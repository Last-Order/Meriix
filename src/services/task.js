import { EventEmitter } from "events";
import log from "electron-log";
import CommandExecuter from "./task_runners/command_executer";
import EncoderLoader from "./task_runners/encoder_loader";
import systemUtils from "@/utils/system";
import { VideoMuxer, VideoTrack, AudioTrack } from "./task_runners/video_muxer";
const fs = require("fs");

class TaskService extends EventEmitter {
    constructor(task) {
        super();
        this.task = task;
        this.currentStepIndex = -1;
        log.info("Task 创建", this.task);
    }
    run() {
        this.emit("start");
        this.runNextStep();
    }
    runNextStep() {
        this.currentStepIndex++;
        this.emit("step", this.currentStepIndex);
        if (this.currentStepIndex === this.task.steps.length) {
            this.emit("finish", this.task);
            log.info("当前任务完成");
            return;
        }
        const currentStep = this.task.steps[this.currentStepIndex];
        log.debug(`任务 步数 ${this.currentStepIndex + 1} / ${this.task.steps.length}`);
        log.debug(`当前步骤`, currentStep);
        this.emit("progress", {
            phase: currentStep.stepName,
        });
        // 自定义函数
        if (currentStep.type === "function") {
            log.debug("执行自定义函数");
            currentStep.stepFunction().then(() => {
                this.runNextStep();
            });
            return;
        }
        // 删除文件
        if (currentStep.type === "delete") {
            for (const file of currentStep.files) {
                log.debug("删除文件", file);
                try {
                    fs.unlinkSync(file);
                } catch {
                    // 无事发生
                }
            }
            this.runNextStep();
            return;
        }
        let executer;
        if (currentStep.type === "execute") {
            // 直接执行命令
            log.debug("执行自定义命令");
            executer = new CommandExecuter();
        } else if (currentStep.type === "encode") {
            // 直接使用编码器
            log.debug(
                "执行编码器",
                this.task.encoderName,
                this.task.encoderSettings,
                this.currentStepIndex.encoderSettings
            );
            executer = new (EncoderLoader(this.task.encoderName))(
                currentStep.input,
                currentStep.output,
                {
                    encoderSettings: {
                        ...this.task.encoderSettings,
                        ...currentStep.encoderSettings,
                    },
                }
            );
        } else if (currentStep.type === "pipe_encode") {
            // 管道输出到编码器
            log.debug(
                "管道输出到编码器",
                this.task.encoderName,
                this.task.encoderSettings,
                this.currentStepIndex.encoderSettings
            );
            const encoderClass = EncoderLoader(this.task.encoderName);
            if (currentStep.pipe === "avs") {
                log.debug(`创建 AVS 管道 ${currentStep.input} -> ${currentStep.output}`);
                const AVSPipe = require("./task_runners/pipes/avspipe").default;
                executer = new AVSPipe(currentStep.input, currentStep.output, encoderClass, {
                    encoderSettings: {
                        ...this.task.encoderSettings,
                        ...currentStep.encoderSettings,
                    },
                });
            } else if (currentStep.pipe === "smg") {
                log.debug(`创建 SMG 管道 ${currentStep.input} -> ${currentStep.output}`);
                const SMGPipe = require("./task_runners/pipes/smgpipe").default;
                executer = new SMGPipe(
                    currentStep.input,
                    currentStep.output,
                    {
                        duration: currentStep.duration,
                        height: currentStep.height,
                        width: currentStep.width,
                    },
                    encoderClass
                );
            }
        } else if (currentStep.type === "mux") {
            // 混流
            log.debug(
                "混流",
                currentStep.videoTracks,
                currentStep.audioTracks,
                "->",
                currentStep.output
            );
            if (currentStep.type === "mux") {
                const videoMuxer = new VideoMuxer(currentStep.output);
                if (currentStep.videoTracks) {
                    videoMuxer.addVideoTracks(
                        currentStep.videoTracks.map((track) => new VideoTrack(track))
                    );
                }
                if (currentStep.AudioTracks) {
                    videoMuxer.addAudioTracks(
                        currentStep.audioTracks.map((track) => new AudioTrack(track))
                    );
                }
                executer = videoMuxer;
            }
        }
        executer.on("start", (child) => {
            this.emit("start", child);
        });
        executer.on("progress", (event) => {
            this.emit("progress", event);
        });
        executer.on("success", () => {
            this.runNextStep();
        });
        executer.on("fail", () => {
            this.emit("fail");
        });
        executer.on("stdout", (data) => {
            this.emit("output", {
                type: "normal",
                content: data,
            });
        });
        executer.on("stderr", (data) => {
            this.emit("output", {
                type: "error",
                content: data,
            });
        });
        if (currentStep.type === "execute") {
            executer.run(systemUtils.fillPlaceholders(currentStep.command));
        } else {
            executer.run();
        }
    }
}

export default TaskService;
