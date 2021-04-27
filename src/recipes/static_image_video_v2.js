import BaseRecipe from "./base_recipe";
import Media from "@/services/media";

export class AudioParsingError extends Error {}

export default class StaticImageVideoV2 extends BaseRecipe {
    static get definition() {
        return {
            id: "static_image_video_v2",
            name: "一图流 V2",
            description: "将图片和音频压制为一图流视频",
            version: "1.0.0",
            dependencies: ["smg", "ffmpeg"],
            userOptions: [
                {
                    name: "resolution",
                    label: "分辨率",
                    type: "select",
                    values: ["1080p", "720p"],
                    defaultValue: "720p",
                },
            ],
        };
    }

    static check(files) {
        // 存在一个图片文件 其余文件为音频
        const imageFileIndex = Array.prototype.findIndex.call(files, (f) =>
            f.type.startsWith("image")
        );
        if (imageFileIndex === -1) {
            return false;
        }
        if (files.length < 2) {
            return false;
        }
        for (let index = 0; index < files.length; index++) {
            const audioRegex = new RegExp(
                "^.+(mp3|flac|aac|alac|wav|m4a|ac3|ogg|wma|opus|mp4)$",
                "i"
            );
            const isAudio = audioRegex.test(files[index].path);
            if (!isAudio && index !== imageFileIndex) {
                return false;
            }
        }
        return true;
    }

    static async generateTasks(files, options = {}) {
        const { resolution = "720p" } = options;
        const tasks = [];
        const imageFile = Array.prototype.find.call(files, (f) => f.type.startsWith("image"));
        const audioFiles = Array.prototype.filter.call(files, (f) => !f.type.startsWith("image"));
        const resolutionMapping = {
            "1080p": {
                width: 1920,
                height: 1080,
            },
            "720p": {
                width: 1280,
                height: 720,
            },
        };

        for (const audioFile of audioFiles) {
            let audioDuration;
            try {
                audioDuration =
                    (await Media.getAudioMetadata(audioFile.path)).format.duration * 1000;
            } catch (e) {
                console.log(e);
                throw new AudioParsingError("音频信息解析失败");
            }
            tasks.push({
                ...StaticImageVideoV2.definition,
                displayName: `${StaticImageVideoV2.definition.name} - ${audioFile.name}`,
                output: `${audioFile.path + ".smg.mux.mp4"}`,
                steps: [
                    {
                        stepName: "渲染视频",
                        type: "pipe_encode",
                        pipe: "smg",
                        input: imageFile.path,
                        output: `${audioFile.path}.smg.264`,
                        duration: Math.ceil(audioDuration),
                        width: resolutionMapping[resolution].width,
                        height: resolutionMapping[resolution].height,
                    },
                    {
                        stepName: "混流",
                        type: "execute",
                        command:
                            '"${ffmpeg}"' +
                            ` -i "${audioFile.path + ".smg.264"}" -i "${
                                audioFile.path
                            }" -c:v copy -c:a aac -b:a 320k "${audioFile.path + ".smg.mux.mp4"}"`,
                    },
                    {
                        stepName: "清理文件",
                        type: "delete",
                        files: [audioFile.path + ".smg.264"],
                    },
                ],
            });
        }
        return tasks;
    }
}
