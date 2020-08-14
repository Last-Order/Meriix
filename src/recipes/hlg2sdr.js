const path = require("path");
import BaseRecipe from "./base_recipe";

export default class HLG2SDR extends BaseRecipe {
    static get definition() {
        return {
            id: "hlg_to_sdr",
            name: "HLG转换SDR（Nvidia）",
            description: "将HLG视频转换为SDR",
            dependencies: ["nvencc"],
            encoderWhitelist: ["nvencc"],
            userOptions: [
                {
                    name: "target_lightness",
                    label: "目标亮度",
                    type: "select",
                    values: ["300nits", "200nits", "100nits"],
                    defaultValue: "300nits",
                },
                {
                    name: "bitrate",
                    label: "目标码率",
                    type: "select",
                    values: ["20M", "24M", "30M"],
                    defaultValue: "20M",
                },
                {
                    name: "audio_track_index",
                    label: "音轨序号",
                    type: "input",
                    defaultValue: "1",
                },
            ],
        };
    }

    static get bitrateMap() {
        return {
            "20M": 20000,
            "24M": 24000,
            "30M": 30000,
        };
    }

    static get lightnessMap() {
        return {
            "300nits": 300,
            "200nits": 200,
            "100nits": 100,
        };
    }

    /**
     * @param {FileList} files
     */
    static check(files) {
        // 全部文件以 TS/M2TS 为后缀
        for (const file of files) {
            const fp = path.parse(file.path);
            if (fp.ext !== ".ts" && fp.ext !== "m2ts") {
                return false;
            }
        }
        return true;
    }

    static generateTasks(files, options) {
        const tasks = [];
        const {
            bitrate,
            target_lightness: targetLightness,
            audio_track_index: audioTrackIndex,
        } = options;
        for (const file of files) {
            tasks.push({
                ...HLG2SDR.definition,
                displayName: `${HLG2SDR.definition.name} - ${file.name}`,
                output: `${file.path}.sdr.mp4`,
                steps: [
                    {
                        stepName: "压制",
                        type: "encode",
                        input: file.path,
                        output: `${file.path}.sdr.mp4`,
                        encoderSettings: {
                            "vpp-colorspace": `transfer=arib-std-b67:bt709,matrix=bt2020nc:bt709,colorprim=bt2020:bt709,hdr2sdr=hable,ldr_nits=${HLG2SDR.lightnessMap[targetLightness]}`,
                            vbr: HLG2SDR.bitrateMap[bitrate],
                            "audio-codec": `${audioTrackIndex}?aac`,
                        },
                    },
                ],
            });
        }
        return tasks;
    }
}
