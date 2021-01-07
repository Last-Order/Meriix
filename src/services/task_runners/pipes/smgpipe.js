import { EventEmitter } from "events";
import template from "../../../utils/string_template";

class SMGPipe extends EventEmitter {
    static commandTemplates = {
        nvencc:
            '"${smg}" --input "${input}" -d "${duration}" -c -w ${width} -h ${height} | "${nvencc}" --y4m -i - -o "${output}"',
        qsvencc:
            '"${smg}" --input "${input}" -d "${duration}" -c -w ${width} -h ${height} | "${qsvencc}" --y4m -i - -o "${output}"',
        x264:
            '"${smg}" --input "${input}" -d "${duration}" -c -w ${width} -h ${height} | "${x264}" --demuxer y4m -o "${output}" -',
    };
    constructor(input, output, { duration, width = 1280, height = 720 }, encoder, encoderSettings) {
        super();
        this.input = input;
        this.output = output;
        this.duration = duration;
        this.width = width;
        this.height = height;
        this.encoderName = encoder.encoderName;
        this.encoderSettings = encoderSettings;
        this.encoder = new encoder(this.input, this.output, this.encoderSettings);
        this.totalFrames = 0;
    }
    run() {
        if (!SMGPipe.commandTemplates[this.encoderName]) {
            throw new Error(`StaticMovieGenerator can not pipe to ${this.encoderName}`);
        }
        this.encoder.setCommandTemplate(
            template(SMGPipe.commandTemplates[this.encoderName], {
                duration: this.duration,
                width: this.width,
                height: this.height,
            })
        );
        this.encoder.on("stderr", (log) => {
            if (!this.totalFrames) {
                const match = log.match(/Total frames: (\d+)/);
                if (match) {
                    this.totalFrames = parseInt(match[1]);
                }
            }
            this.emit("stderr", log);
        });
        this.encoder.on("frame-encoded", (encodedFrames) => {
            if (this.totalFrames) {
                this.emit("progress", {
                    phase: "压制",
                    progress: Math.round((encodedFrames / this.totalFrames) * 100),
                });
            }
        });
        this.encoder.on("fail", (child) => {
            this.emit("fail", child);
        });
        this.encoder.on("success", () => {
            this.emit("success");
        });
        this.encoder.on("start", (child) => {
            this.emit("start", child);
        });
        this.encoder.run();
    }
}

export default SMGPipe;
