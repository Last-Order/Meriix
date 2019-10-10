import EventEmitter from 'events';
import { decode } from '@/utils/encoding';

const exec = require('child_process').exec;
/**
 * 命令执行
 * @param {string} command 
 */
export default class CommandExecuter extends EventEmitter {
    run(command, { output = ['stdout', 'stderr'] } = {}) {
        // eslint-disable-next-line no-console
        console.log('RUN: ' + command);
        const child = exec(command, {
            encoding: 'binary'
        });
        if (output.includes('stdout')) {
            child.stdout.on('data', (data) => {
                // eslint-disable-next-line no-control-regex
                this.emit('stdout', decode(data.replace(/\x08/ig, ''), 'binary', 'cp936'));
            });
        }
        if (output.includes('stderr')) {
            child.stderr.on('data', (data) => {
                // eslint-disable-next-line no-control-regex
                this.emit('stderr', decode(data.replace(/\x08/ig, ''), 'binary', 'cp936'));
            });
        }
        child.on('close', (code) => {
            if (code === 0) {
                this.emit('success');
            } else {
                this.emit('fail', child);
            }
        });
    }
}