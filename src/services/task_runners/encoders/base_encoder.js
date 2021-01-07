import { EventEmitter } from "events";
import CommandExecuter from "../command_executer";
import systemUtils from "@/utils/system";
import template from "@/utils/string_template";

export default class Encoder extends EventEmitter {
    constructor(input, output, settings = {}) {
        super();
        this.input = input;
        this.output = output;
        this.settings = settings;
        this.commandTemplate = "";
        this.commandExecuter = new CommandExecuter();
    }
    run() {
        if (!this.commandTemplate) {
            throw new Error("Empty command template for encoder.");
        }
        let command = template(this.commandTemplate, {
            input: this.input,
            output: this.output,
        });
        if (this.settings.encoderSettings) {
            command +=
                " " +
                Object.entries(this.settings.encoderSettings)
                    .map((entry) => {
                        const [key, value] = entry;
                        return `--${key} "${value}"`;
                    })
                    .join(" ");
        }
        this.commandExecuter.on("stderr", (data) => {
            this.onLogPrinted(data);
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
        this.commandExecuter.run(systemUtils.fillPlaceholders(command), ["stderr"]);
    }
    /**
     * 日志打印时调用
     */
    onLogPrinted() {}
    /**
     * 设置命令模板
     * @param {string} commandTemplate
     */
    setCommandTemplate(commandTemplate) {
        this.commandTemplate = commandTemplate;
    }
}
