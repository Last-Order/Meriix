import { EventEmitter } from "events";
import Dependence from "@/services/dependence";

class DownloadService extends EventEmitter {
    constructor(modules, base) {
        super();
        this.modules = modules;
        this.base = base;
        this.files = [];
    }
    getDownloadFiles() {
        for (const name of this.modules) {
            this.files = this.files.concat(Dependence.getRemoteModuleFiles(name, `${this.base}`));
        }
        return this.files;
    }
}

export default DownloadService;