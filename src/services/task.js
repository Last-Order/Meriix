import { EventEmitter } from "events";
import CommandExecuter from "./task_runners/command_executer";
import systemUtils from '@/utils/system';

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
        if (currentStep.type === 'execute') {
            this.emit('progress', {
                phase: currentStep.stepName
            });
            const executer = new CommandExecuter();
            executer.run(systemUtils.fillPlaceholders(currentStep.command));
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
}

export default TaskService;