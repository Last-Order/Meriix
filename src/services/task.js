import { EventEmitter } from 'events';
import CommandExecuter from './task_runners/command_executer';
import AVS2NvenccEncoder from './task_runners/avs2nvencc';
import SMG2NvenccEncoder from './task_runners/smg2nvencc';
import NvencEncoder from './task_runners/nvenc';
import EncoderLoader from './task_runners/encoder_loader';
import systemUtils from '@/utils/system';
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
            executer = new CommandExecuter();
        } else if (currentStep.type === 'encode') {
            executer = new (EncoderLoader(this.task.encoderName))(currentStep.input, currentStep.output, {
                ...this.task.encoderSettings,
                ...currentStep.settings
            });
        } else if (currentStep.type === 'pipe_encode') {
            const encoderClass = EncoderLoader(this.task.encoderName);
            if (currentStep.pipe === 'avs') {
                const AVSPipe = require('./task_runners/pipes/avspipe');
                executer = new AVSPipe(currentStep.input, currentStep.output, encoderClass, {
                    ...this.task.encoderSettings,
                    ...currentStep.settings
                });
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
        executer.run(systemUtils.fillPlaceholders(currentStep.command));
    }
}

export default TaskService;