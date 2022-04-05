import BaseRecipe from "./base_recipe";
const path = require("path");

export default class NormalizeFLAC extends BaseRecipe {
    static get definition() {
        return {
            id: "normalize_flac",
            name: "规格化FLAC",
            version: "1.0.0",
            description: "重编码FLAC到44.1kHz/16bit",
            dependencies: ["ffmpeg"],
        };
    }

    /**
     * @param {FileList} files
     */
    static check(files) {
        // 全部文件都是 FLAC
        for (let index = 0; index < files.length; index++) {
            if (!files[index].path.toLowerCase().endsWith("flac")) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param {FileList} files
     */
    static generateTasks(files) {
        const tasks = [];
        for (let index = 0; index < files.length; index++) {
            const parsedPath = path.parse(files[index].path);
            const outputPath = path.resolve(parsedPath.dir, `${parsedPath.name}.normalized.flac`);
            tasks.push({
                ...NormalizeFLAC.definition,
                output: outputPath,
                displayName: `${NormalizeFLAC.definition.name} - ${files[index].name}`,
                steps: [
                    {
                        stepName: "重编码",
                        type: "execute",
                        command: '"${ffmpeg}"' + ` -i "${files[index].path}" -af aformat=s16:44100 "${outputPath}"`,
                    },
                ],
            });
        }
        return tasks;
    }
}
