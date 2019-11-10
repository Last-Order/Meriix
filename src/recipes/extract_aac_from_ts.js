import BaseRecipe from "./base_recipe";
const path = require('path');

export default class ExtractAudioFromTS extends BaseRecipe {
    static get definition() { 
        return {
            id: 'extract_aac_from_ts',
            name: '音频抽取',
            description: '从 TS 容器抽取音频',
            dependencies: ['eac3to']
        };
    }

    /**
     * @param {FileList} files
     */
    static check(files) {
        // 全部文件都是 TS 容器
        for (let index = 0; index < files.length; index++) {
            if (!files[index].path.toLowerCase().endsWith('ts')) {
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
            const outputPath = path.resolve(parsedPath.dir, `${parsedPath.name}.aac`);
            tasks.push({
                id: ExtractAudioFromTS.definition.id,
                name: ExtractAudioFromTS.definition.name,
                output: outputPath,
                displayName: `${ExtractAudioFromTS.definition.name} - ${files[index].name}`,
                steps: [{
                    stepName: '抽取',
                    type: 'execute',
                    command: '"${eac3to}"' + ` "${files[index].path}" "${outputPath}"`
                }]
            });
        }
        return tasks;
    }
}