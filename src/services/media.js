class MediaService {
    static async getAudioMetadata(path) {
        const mm = require("music-metadata");
        return await mm.parseFile(path, {
            duration: true,
        });
    }
}

export default MediaService;
