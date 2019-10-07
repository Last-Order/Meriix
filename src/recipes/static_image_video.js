import BaseRecipe from "./base_recipe";

export default class StaticImageVideo extends BaseRecipe {
    static get definition() { 
        return {
            name: '一图流',
            description: '将图片和音频压制为一图流视频'
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
        for (let index = 0; index < files.length; index++) {
            const audioRegex = new RegExp('^.+(mp3|flac|aac|alac|wav)$')
            const isAudio = audioRegex.test(files[index].path);
            if (!isAudio && index !== imageFileIndex) {
                return false;
            }
        }
        return true;
    }
}