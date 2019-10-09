import { EventEmitter } from 'events';
import CommandExecuter from './task_runners/command_executer';
import AVS2NvencEncoder from './task_runners/avs2evenc';
import NvencEncoder from './task_runners/nvenc';
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
                fs.unlinkSync(file);
            }
            this.runNextStep();
            return;
        }
        let executer;
        if (currentStep.type === 'execute') {
            executer = new CommandExecuter();
            executer.run(systemUtils.fillPlaceholders(currentStep.command));
        } else if (currentStep.type === 'encode') {
            if (currentStep.encoder === 'nvencc') {
                executer = new NvencEncoder();
                executer.run(systemUtils.fillPlaceholders(currentStep.command));
            }
            if (currentStep.encoder === 'avs2nvencc') {
                executer = new AVS2NvencEncoder();
                executer.run(systemUtils.fillPlaceholders(currentStep.command));
            }
        }
        executer.on('progress', event => {
            this.emit('progress', event);
        })
        executer.on('success', () => {
            this.runNextStep();
            this.emit('success');
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
    }
}

export default TaskService;