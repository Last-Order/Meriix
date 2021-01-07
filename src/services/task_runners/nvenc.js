import { EventEmitter } from "events";
import CommandExecuter from "./command_executer";
export default class NvencEncoder extends EventEmitter {
    constructor() {
        super();
        this.commandExecuter = new CommandExecuter();
    }
    run(command) {
        this.commandExecuter.on("stderr", (data) => {
            const match = data.match(/\[(.+?)%\]/);
            if (match) {
                this.emit("progress", {
                    phase: "压制",
                    progress: parseFloat(match[1]),
                });
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
