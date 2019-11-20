const path = require('path');
const fs = require('fs');
import { EventEmitter } from "events";
import axios from 'axios';
import SystemUtils from "@/utils/system";
import Dependence from "@/services/dependence";

class DownloadService extends EventEmitter {
    constructor(modules, base) {
        super();
        this.modules = modules;
        this.base = base;
        this.files = [];
        this.totalFileCount = 0;
        this.downloadedFileCount = 0;
    }
    /**
     * 获得要下载的文件列表
     */
    getDownloadFiles() {
        const result = [];
        for (const name of this.modules) {
            result.push(...Dependence.getRemoteModuleFiles(name, `${this.base}`));
        }
        return result;
    }
    async download() {
        this.files = this.getDownloadFiles();
        this.downloadedFileCount = 0;
        this.totalFileCount = this.files.length;
        for (const file of this.files) {
            this.emit('download', file.name);
            const response = await axios({
                url: file.url,
                method: 'GET',
                responseType: 'arraybuffer',
            });
            this.saveFile(response.data, path.resolve(SystemUtils.externalBasePath(), `.${file.path}`));
            this.downloadedFileCount++;
            this.emit('progress', (this.downloadedFileCount / this.totalFileCount * 100).toFixed(2));
        }
        this.emit('finish');
    }
    /**
     * 保存文件
     * @param {any} data 
     * @param {string} savePath 
     */
    saveFile(data, savePath) {
        const parsedPath = path.parse(savePath);
        if (!fs.existsSync(parsedPath.dir)) {
            fs.mkdirSync(parsedPath.dir, {
                recursive: true
            });
        }
        fs.writeFileSync(savePath, Buffer.from(data), 'binary')
    }
}

export default DownloadService;