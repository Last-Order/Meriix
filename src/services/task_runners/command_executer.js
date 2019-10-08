import EventEmitter from 'events';

const exec = require('child_process').exec;
/**
 * 命令执行
 * @param {string} command 
 */
export default class CommandExecuter extends EventEmitter {
    run(command) {
        const child = exec(command);
        child.stdout.on('data', (data) => {
            this.emit('stdout', data);
        });
        child.stderr.on('data', (data) => {
            this.emit('stderr', data);
        });
        child.on('close', (code) => {
            if (code === 0) {
                this.emit('success');
            } else {
                this.emit('fail', child);
            }
        });
    }
}