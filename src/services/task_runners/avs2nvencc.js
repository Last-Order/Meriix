import { EventEmitter } from "events";
import CommandExecuter from "./command_executer";
export default class AVSToNvencEncoder extends EventEmitter {
    constructor() {
        super();
        this.commandExecuter = new CommandExecuter();
        this.totalFrames = 0;
    }
    run(command) {
        this.commandExecuter.on("stderr", (data) => {
            if (!this.totalFrames) {
                const match = data.match(/writing (\d+) frame/);
                if (match) {
                    this.totalFrames = parseInt(match[1]);
                }
            } else {
                const match = data.match(/(\d+) frames/);
                if (match) {
                    this.emit("progress", {
                        phase: "压制",
                        progress: Math.round((parseFloat(match[1]) / this.totalFrames) * 100),
                    });
                }
            }
            this.emit("stderr", data);
        });
        this.commandExecuter.on("fail", (child) => {
            this.emit("fail", child);
        });
        this.commandExecuter.on("success", () => {
            this.emit("success");
        });
        this.commandExecuter.on("start", (child) => {
            this.emit("start", child);
        });
        this.commandExecuter.run(command, ["stderr"]);
    }
}
