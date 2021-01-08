import BaseRecipe from "./base_recipe";
import systemUtils from "@/utils/system";
const iconv = require("iconv-lite");
const path = require("path");
const fs = require("fs");

/**
 * IVTC 消极处理
 * AVS进行IVTC后交由硬件编码压制
 */
class NegativeIVTC extends BaseRecipe {
    static get definition() {
        return {
            name: "IVTC(消极、电视适用)",
            description: "进行消极的IVTC处理",
            dependencies: ["avs2pipemod", "eac3to", "ffmpeg"],
        };
    }

    /**
     * @param {FileList} files
     */
    static check(files) {
        // 全部文件以 TS 为后缀
        for (const file of files) {
            const fp = path.parse(file.path);
            if (fp.ext !== ".ts") {
                return false;
            }
        }
        return true;
    }

    static generateTasks(files) {
        const tasks = [];
        for (const file of files) {
            tasks.push({
                ...NegativeIVTC.definition,
                displayName: `${NegativeIVTC.definition.name} - ${file.name}`,
                output: `${file.path}.ivtc.mux.mp4`,
                steps: [
                    {
                        stepName: "写入 AVS 脚本",
                        type: "function",
                        stepFunction: async () => {
                            const avsTemplate = `
                        LoadPlugin("${path.resolve(
                            systemUtils.externalBasePath(),
                            "./avs2pipemod/plugins/LSMASHSource.dll"
                        )}")
                        LoadPlugin("${path.resolve(
                            systemUtils.externalBasePath(),
                            "./avs2pipemod/plugins/TIVTC.dll"
                        )}")
                        LWLibavVideoSource("${file.path}")
                        tfm()
                        tdecimate()
                        LanczosResize(1920, 1080)
                        ConvertToYV12()
                        `;
                            fs.writeFileSync(
                                path.resolve(path.dirname(file.path), "template.avs"),
                                iconv.encode(avsTemplate, "gbk")
                            );
                            return Promise.resolve();
                        },
                    },
                    {
                        stepName: "压制",
                        type: "pipe_encode",
                        input: path.resolve(path.dirname(file.path), "template.avs"),
                        pipe: "avs",
                        output: file.path + ".ivtc.mp4",
                        encoderSettings: {
                            vbr: 5950,
                        },
                    },
                    {
                        stepName: "抽取音频",
                        type: "execute",
                        command: '"${eac3to}"' + ` "${file.path}" "${file.path}.aac"`,
                    },
                    {
                        stepName: "混流",
                        type: "execute",
                        command:
                            '"${ffmpeg}"' +
                            ` -i "${file.path}.ivtc.mp4" -i "${file.path}.aac" -c copy "${file.path}.ivtc.mux.mp4"`,
                    },
                    {
                        stepName: "清理文件",
                        type: "delete",
                        files: [
                            path.resolve(path.dirname(file.path), "template.avs"),
                            path.resolve(path.dirname(file.path), `${file.name}.ivtc.mp4`),
                            path.resolve(path.dirname(file.path), `${file.name}.aac`),
                        ],
                    },
                ],
            });
        }
        return tasks;
    }
}

export default NegativeIVTC;
