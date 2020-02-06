import { EventEmitter } from "events";
/**
 * Avisynth Pipe
 */
class AVSPipe extends EventEmitter {
    static commandTemplates = {
        'nvencc': '"${avs2pipemod}" -y4mp "${input}" | "${nvencc}" --y4m -i - -o "${output}"'
    };
    constructor(input, output, encoder, encoderSettings) {
        super();
        this.input = input;
        this.output = output;
        this.encoder = new encoder(this.input, this.output, this.encoderSettings);
        this.encoderName = encoder.encoderName;
        this.encoderSettings = encoderSettings;
        this.totalFrames = 0;
    }
    run() {
        if (!AVSPipe.commandTemplates[this.encoderName]) {
            throw new Error(`Avisynth can not pipe to ${this.encoderName}`);
        }
        this.encoder.setCommandTemplate(AVSPipe.commandTemplates[this.encoderName]);
        this.encoder.on('stderr', log => {
            if (!this.totalFrames) {
                const match = log.match(/writing (\d+) frame/);
                if (match) {
                    this.totalFrames = parseInt(match[1]);
                }
            }
            this.emit('stderr', log);
        });
        this.encoder.on('frame-encoded', encodedFrames => {
            if (this.totalFrames) {
                this.emit('progress', {
                    phase: '压制',
                    progress: Math.round(encodedFrames / this.totalFrames * 100)
                });
            }
        });
        this.encoder.on('fail', (child) => {
            this.emit('fail', child);
        });
        this.encoder.on('success', () => {
            this.emit('success');
        });
        this.encoder.on('start', (child) => {
            this.emit('start', child);
        });
        this.encoder.run();
    }
}

export default AVSPipe;