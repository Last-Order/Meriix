import { EventEmitter } from 'events';
import CommandExecuter from './task_runners/command_executer';
import EncoderLoader from './task_runners/encoder_loader';
import systemUtils from '@/utils/system';
import { VideoMuxer, VideoTrack, AudioTrack } from './task_runners/video_muxer';
const fs = require('fs');

class TaskService extends EventEmitter {
    constructor(task) {
        super();
        this.task = task;
        this.currentStepIndex = -1;
    }
    run() {
        this.emit('start');
        this.runNextStep();
    }
    runNextStep() {
        this.currentStepIndex++;
        if (this.currentStepIndex === this.task.steps.length) {
            this.emit('finish', this.task);
            return;
        }
        const currentStep = this.task.steps[this.currentStepIndex];
        this.emit('progress', {
            phase: currentStep.stepName
        });
        // 自定义函数
        if (currentStep.type === 'function') {
            currentStep.stepFunction().then(() => {
                this.runNextStep();
            });
            return;
        }
        // 删除文件
        if (currentStep.type === 'delete') {
            for (const file of currentStep.files) {
                try {
                    fs.unlinkSync(file);
                } catch {
                    // 无事发生
                }
            }
            this.runNextStep();
            return;
        }
        let executer;
        if (currentStep.type === 'execute') {
            // 直接执行命令
            executer = new CommandExecuter();
        } else if (currentStep.type === 'encode') {
            // 直接使用编码器
            executer = new (EncoderLoader(this.task.encoderName))(currentStep.input, currentStep.output, {
                ...this.task.encoderSettings,
                ...currentStep.settings
            });
        } else if (currentStep.type === 'pipe_encode') {
            // 管道输出到编码器
            const encoderClass = EncoderLoader(this.task.encoderName);
            if (currentStep.pipe === 'avs') {
                const AVSPipe = require('./task_runners/pipes/avspipe').default;
                executer = new AVSPipe(currentStep.input, currentStep.output, encoderClass, {
                    encoderSettings: {
                        ...this.task.encoderSettings,
                        ...currentStep.encoderSettings
                    }
                });
            } else if (currentStep.pipe === 'smg') {
                const SMGPipe = require('./task_runners/pipes/smgpipe').default;
                executer = new SMGPipe(currentStep.input, currentStep.output, currentStep.duration, encoderClass);
            }
        } else if (currentStep.type === 'mux') {
            // 混流
            if (currentStep.type === 'mux') {
                const videoMuxer = new VideoMuxer(currentStep.output);
                if (currentStep.videoTracks) {
                    videoMuxer.addVideoTracks(currentStep.videoTracks.map(track => new VideoTrack(track)));
                }
                if (currentStep.AudioTracks) {
                    videoMuxer.addAudioTracks(currentStep.audioTracks.map(track => new AudioTrack(track)));
                }
                executer = videoMuxer;
            }
        }
        executer.on('start', (child) => {
            this.emit('start', child)
        });
        executer.on('progress', event => {
            this.emit('progress', event);
        })
        executer.on('success', () => {
            this.runNextStep();
        });
        executer.on('fail', () => {
            this.emit('fail');
        });
        executer.on('stdout', (data) => {
            this.emit('output', {
                type: 'normal',
                content: data
            });
        });
        executer.on('stderr', (data) => {
            this.emit('output', {
                type: 'error',
                content: data
            });
        });
        if (currentStep.type === 'execute') {
            executer.run(systemUtils.fillPlaceholders(currentStep.command));
        } else {
            executer.run();
        }
    }
}

export default TaskService;