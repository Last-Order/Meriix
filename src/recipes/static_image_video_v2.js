import BaseRecipe from "./base_recipe";
import Media from "@/services/media";
const fs = require('fs');
const path = require('path');

export class AudioParsingError extends Error { }

export default class StaticImageVideoV2 extends BaseRecipe {
    static get definition() {
        return {
            name: '一图流 V2',
            description: '将图片和音频压制为一图流视频',
            dependencies: ['smg', 'ffmpeg', 'nvencc']
        };
    }

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

    static async generateTasks(files) {
        const tasks = [];
        const imageFile = Array.prototype.find.call(files, f => f.type.startsWith('image'));
        const audioFiles = Array.prototype.filter.call(files, f => !f.type.startsWith('image'));
        for (const audioFile of audioFiles) {
            let audioDuration;
            try {
                audioDuration = (await Media.getAudioMetadata(audioFile.path)).format.duration * 1000;
            } catch (e) {
                throw new AudioParsingError('音频信息解析失败');
            }
            tasks.push({
                ...StaticImageVideoV2.definition,
                displayName: `${StaticImageVideoV2.definition.name} - ${audioFile.name}`,
                output: `${audioFile.path + '.smg.mux.mp4'}`,
                steps: [{
                    stepName: '渲染视频',
                    type: 'encode',
                    encoder: 'nvencc',
                    command: '"${smg}"' + ` --input "${imageFile.path}" -d ${Math.ceil(audioDuration)} -c | ` + '"${nvencc}"' + ` --y4m -i - -o "${audioFile.path}.smg.mp4"`
                }, {
                    stepName: '混流',
                    type: 'execute',
                    command: '"${ffmpeg}"' + ` -i "${audioFile.path + '.smg.mp4'}" -i "${audioFile.path}" -c:v copy -c:a aac -b:a 320k "${audioFile.path + '.smg.mux.mp4'}"`
                }, {
                    stepName: '清理文件',
                    type: 'delete',
                    files: [
                        audioFile.path + '.smg.mp4',
                    ]
                }]
            })
        }
        return tasks;
    }
}