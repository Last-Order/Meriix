import BaseEncoder from "./base_encoder";

class NvenccEncoder extends BaseEncoder {
    static encoderName = "nvencc";
    constructor(input, output, settings) {
        super(input, output, settings);
        this.commandTemplate = '"${nvencc}" -i "${input}" -o "${output}"';
        this.encodedFrames = 0;
        this.progress = 0;
    }
    onLogPrinted(log) {
        if (log.match(/(\d+) frames:/)) {
            this.encodedFrames = parseInt(log.match(/(\d+) frames:/)[1]);
            this.emit("frame-encoded", this.encodedFrames);
        }
        if (log.match(/\[(.+)%\]/)) {
            this.progress = parseFloat(log.match(/\[(.+)%\]/)[1]);
            this.emit("progress", {
                phase: "压制",
                progress: this.progress,
            });
        }
        this.emit("stderr", log);
    }
}

export default NvenccEncoder;
