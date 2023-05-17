import BaseEncoder from "./base_encoder";

class X264Encoder extends BaseEncoder {
    static encoderName = "x264";
    constructor(input, output, settings) {
        super(input, output, settings);
        this.commandTemplate = '"${x264}" -o "${output}" "${input}"';
        this.encodedFrames = 0;
        this.progress = 0;
    }
    onLogPrinted(log) {
        if (log.match(/(\d+) frames:/)) {
            this.encodedFrames = parseInt(log.match(/(\d+) frames:/)[1]);
            this.emit("frame-encoded", this.encodedFrames);
        }
        this.emit("stderr", log);
    }
}

export default X264Encoder;
