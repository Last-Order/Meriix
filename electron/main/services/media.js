class MediaService {
    static async getAudioMetadata(path) {
        const mm = await import("music-metadata");
        const result = await mm.parseFile(path, {
            duration: true,
        });
        console.log(result)
        return result;
    }
}

export default MediaService;
