const fs = require("fs");
const path = require("path");
import CommandExecuter from "./command_executer";
import systemUtils from "@/utils/system";
const subtitleLanguageNameMapping = {
    "zh-hans": "中文（简体）",
    "zh-hant": "中文（繁體）",
    cht: "中文（繁體）",
    ja: "日本語",
    jpn: "日本語",
    en: "English",
    ms: "Malay",
};
const subtitleLanguageCodeMapping = {
    "zh-hans": "chi",
    "zh-hant": "chi",
    cht: "chi",
    ja: "jpn",
    jpn: "jpn",
    en: "eng",
    ms: "may",
};
class VideoTrack {
    constructor({ path }) {
        this.type = "video";
        this.path = path;
    }
}
class AudioTrack {
    constructor({ path }) {
        this.type = "audio";
        this.path = path;
    }
}
class Subtitle {
    constructor({ path, lang }) {
        this.type = "subtitle";
        this.path = path;
        if (lang) {
            this.lang = lang;
        }
    }
}
class VideoMuxer {
    constructor(outputPath) {
        if (!outputPath) {
            throw new Error("请指定输出路径");
        }
        const parsedPath = path.parse(outputPath);
        this.outputPathName = parsedPath.name;
        this.outputPathExt = parsedPath.ext;
        this.outputPath = outputPath;
        this.videoTracks = [];
        this.audioTracks = [];
        this.subtitles = [];
        this.commandExecuter = new CommandExecuter();
    }
    addVideoTracks(...tracks) {
        this.videoTracks.push(...tracks);
    }
    addAudioTracks(...tracks) {
        this.audioTracks.push(...tracks);
    }
    addSubtitles(...subtitles) {
        this.subtitles.push(...subtitles);
    }
    async run() {
        const allTracks = [...this.videoTracks, ...this.audioTracks, ...this.subtitles];
        let command = '"${ffmpeg}" ';
        // Add input
        for (const track of allTracks) {
            command += `-i "${track.path}" `;
        }
        // Add map settings
        for (let i = 0; i <= allTracks.length - 1; i++) {
            const nowTrack = allTracks[i];
            if (nowTrack.type === "video") {
                command += `-map ${i}:v `;
            }
            if (nowTrack.type === "audio") {
                command += `-map ${i}:a `;
            }
            if (nowTrack.type === "subtitle") {
                command += `-map ${i}:s `;
                if (nowTrack.lang) {
                    if (subtitleLanguageNameMapping[nowTrack.lang.toLowerCase()]) {
                        command += `-metadata:s:${i} language="${
                            subtitleLanguageCodeMapping[nowTrack.lang.toLowerCase()]
                        }" -metadata:s:${i} handler="${
                            subtitleLanguageNameMapping[nowTrack.lang.toLowerCase()]
                        }" -metadata:s:${i} title="${
                            subtitleLanguageNameMapping[nowTrack.lang.toLowerCase()]
                        }" `;
                    } else {
                        command += `-metadata:s:${i} "language=${nowTrack.lang.toLowerCase()}" `;
                    }
                }
            }
        }
        if (fs.existsSync(`${this.outputPathName}${this.outputPathExt}`)) {
            this.outputPathName = this.outputPathName + `_${new Date().valueOf().toString()}`;
        }
        if (this.outputPath.endsWith(".mkv")) {
            command += `-c copy -reserve_index_space 200k "${this.outputPathName}${this.outputPathExt}"`;
        } else if (this.outputPath.endsWith(".mp4")) {
            command += `-c copy -movflags faststart "${this.outputPath}${this.outputPathExt}"`;
        }
        this.commandExecuter.on("stderr", (data) => {
            this.emit("stderr", data);
        });
        this.commandExecuter.on("fail", (child) => {
            this.emit("fail", child);
        });
        this.commandExecuter.on("success", () => {
            this.emit("success");
        });
        this.commandExecuter.on("start", (child) => {
            this.emit("start", child);
        });
        this.commandExecuter.run(systemUtils.fillPlaceholders(command), ["stderr"]);
    }
}

export { VideoTrack, AudioTrack, Subtitle, VideoMuxer };
