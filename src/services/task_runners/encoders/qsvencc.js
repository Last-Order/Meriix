import BaseEncoder from './base_encoder';

class QsvenccEncoder extends BaseEncoder {
    static encoderName = 'qsvencc';
    constructor(input, output, settings) {
        super(input, output, settings);
        this.commandTemplate = '${qsvencc} -i "${input}" -o "${output}"';
        this.encodedFrames = 0;
        this.progress = 0;
    }
    onLogPrinted(log) {
        if (log.match(/(\d+) frames:/)) {
            this.encodedFrames = parseInt(log.match(/(\d+) frames:/)[1]);
            this.emit('frame-encoded', this.encodedFrames);
        }
        if (log.match(/\[(.+)%\]/)) {
            this.progress = parseFloat(log.match(/\[(.+)%\]/)[1]);
            this.emit('progress', this.progress);
        }
        this.emit('stderr', log);
    }
}

export default QsvenccEncoder;