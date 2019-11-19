import BaseRecipe from "./base_recipe";
import systemUtils from "@/utils/system";
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

export default class StaticImageVideo extends BaseRecipe {
    static get definition() { 
        return {
            name: '一图流',
            description: '将图片和音频压制为一图流视频',
            dependencies: ['scg', 'avs2pipemod', 'ffmpeg']
        };
    }

    /**
     * @param {FileList} files
     */
    static check(files) {
        // 存在一个图片文件 其余文件为音频
        const imageFileIndex = Array.prototype.findIndex.call(files, f => f.type.startsWith('image'));
        if (imageFileIndex === -1) {
            return false;
        }
        if (files.length < 2) {
            return false;
        }
        for (let index = 0; index < files.length; index++) {
            const audioRegex = new RegExp('^.+(mp3|flac|aac|alac|wav)$', 'i')
            const isAudio = audioRegex.test(files[index].path);
            if (!isAudio && index !== imageFileIndex) {
                return false;
            }
        }
        return true;
    }

    static generateTasks(files) {
        const tasks = [];
        const imageFile = Array.prototype.find.call(files, f => f.type.startsWith('image'));
        const audioFiles = Array.prototype.filter.call(files, f => !f.type.startsWith('image'));
        for (const audioFile of audioFiles) {
            tasks.push({
                ...StaticImageVideo.definition,
                displayName: `${StaticImageVideo.definition.name} - ${audioFile.name}`,
                output: `${audioFile.path + '.scg.mux.mp4'}`,
                steps: [{
                    stepName: '生成背景图片',
                    type: 'execute',
                    command: '"${scg}"' + ` -i "${imageFile.path}" -o "${imageFile.path + '.output.png'}"`
                }, {
                    stepName: '写入 AVS 脚本',
                    type: 'function',
                    stepFunction: async () => {
                        const avsTemplate = `
                        LoadPlugin("${path.resolve(systemUtils.externalBasePath(), './avs2pipemod/plugins/ffms2.dll')}")
                        audio = FFAudioSource("${audioFile.path}")
                        video = ImageSource("${imageFile.path + '.output.png'}", fps=30, start=1, end=ceil(30*AudioLengthF(audio)/AudioRate(audio)))
                        video = ConvertToYV12(video)
                        return video`;
                        fs.writeFileSync(path.resolve(path.dirname(imageFile.path), 'template.avs'), iconv.encode(avsTemplate, 'gbk'));
                        return Promise.resolve();
                    }
                }, {
                    stepName: '压制',
                    type: 'encode',
                    encoder: 'avs2nvencc',
                    command: '"${avs2pipemod}"' + ` --y4mp "${path.resolve(path.dirname(imageFile.path), 'template.avs')}" | ` + '"${nvencc}"' + ` --y4m -i - -o "${audioFile.path + '.scg.mp4'}"`
                }, {
                    stepName: '混流',
                    type: 'execute',
                    command: '"${ffmpeg}"' + ` -i "${audioFile.path + '.scg.mp4'}" -i "${audioFile.path}" -c:v copy -c:a aac -b:a 320k "${audioFile.path + '.scg.mux.mp4'}"`
                }, {
                    stepName: '清理文件',
                    type: 'delete',
                    files: [
                        path.resolve(path.dirname(imageFile.path), 'template.avs'),
                        imageFile.path + '.output.png',
                        audioFile.path + '.scg.mp4',
                        audioFile.path + '.ffindex'
                    ]
                }]
            })
        }
        return tasks;
    }
}