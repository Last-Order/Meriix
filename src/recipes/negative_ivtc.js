import BaseRecipe from "./base_recipe";
import systemUtils from "@/utils/system";
const iconv = require('iconv-lite');
const path = require('path');
const fs = require('fs');

/**
 * IVTC 消极处理
 * AVS进行IVTC后交由硬件编码压制
 */
class NegativeIVTC extends BaseRecipe {
    static get definition() {
        return {
            name: 'IVTC(消极)',
            description: '进行消极的IVTC处理'
        };
    }

    /**
     * @param {FileList} files
     */
    static check(files) {
        // 全部文件以 TS 为后缀
        for (const file of files) {
            const fp = path.parse(file.path);
            if (fp.ext !== '.ts') {
                return false;
            }
        }
        return true;
    }

    static generateTasks(files) {
        const tasks = [];
        for (const file of files) {
            tasks.push({
                id: NegativeIVTC.definition.id,
                name: NegativeIVTC.definition.name,
                displayName: `${NegativeIVTC.definition.name} - ${file.name}`,
                output: `${file.path}.ivtc.mp4`,
                steps: [{
                    stepName: '写入 AVS 脚本',
                    type: 'function',
                    stepFunction: async () => {
                        const avsTemplate = `
                        LoadPlugin("${path.resolve(systemUtils.externalBasePath(), './avs/plugins/LSMASHSource.dll')}")
                        LoadPlugin("${path.resolve(systemUtils.externalBasePath(), './avs/plugins/TIVTC.dll')}")
                        LWLibavVideoSource("${file.path}")
                        tfm()
                        tdecimate()
                        ConvertToYV12()
                        `;
                        fs.writeFileSync(path.resolve(path.dirname(file.path), 'template.avs'), iconv.encode(avsTemplate, 'gbk'));
                        return Promise.resolve();
                    }
                }, {
                    stepName: '压制',
                    type: 'encode',
                    encoder: 'avs2nvencc',
                    command: '"${avs2pipemod}"' + ` --y4mp "${path.resolve(path.dirname(file.path), 'template.avs')}" | ` + '"${nvencc}"' + ` --y4m -i - -o "${file.path + '.ivtc.mp4'}"`
                }, {
                    stepName: '清理文件',
                    type: 'delete',
                    files: [
                        path.resolve(path.dirname(file.path), 'template.avs'),
                    ]
                }]
            })
        }
        return tasks;
    }
}

export default NegativeIVTC;