import { ipcRenderer } from "electron";

class MediaService {
    static async getAudioMetadata(path) {
        return await ipcRenderer.invoke("parse-media-file", path);
    }
}

export default MediaService;
