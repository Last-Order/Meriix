import SystemUtils from "@/utils/system";
const fs = require("fs");
const path = require("path");
const axios = require("axios");
class RemoteDependenceDefinitionFileNotFoundError extends Error {}
class RemoteModuleNotFoundError extends Error {}
class RemoteDependenceDefinitionDownloadError extends Error {}
class DependenceService {
    static getCurrentDependenceInfo() {
        const dependenceInfoFile = path.resolve(SystemUtils.externalBasePath(), "libs.json");
        return JSON.parse(fs.readFileSync(dependenceInfoFile).toString());
    }
    static getRemoteDependenceInfo() {
        const remoteLibDefinitionPath = path.resolve(
            SystemUtils.externalBasePath(),
            "libs_remote.json"
        );
        if (!fs.existsSync(remoteLibDefinitionPath)) {
            throw new RemoteDependenceDefinitionFileNotFoundError(
                "远程依赖库定义不存在，请设定远程依赖库地址"
            );
        }
        const definition = JSON.parse(fs.readFileSync(remoteLibDefinitionPath).toString());
        return definition;
    }
    /**
     * 本地是否已经安装该模块
     * @param {string} name 模块名
     */
    static isModuleInstalled(name) {
        return !!DependenceService.getCurrentDependenceInfo()[name];
    }
    /**
     * 获得本地模块信息
     * @param {string} name 模块名
     */
    static getLocalModuleInfo(name) {
        return DependenceService.getCurrentDependenceInfo()[name];
    }
    /**
     * 添加本地模块定义
     * @param {string} name 模块名
     * @param {object} moduleInfo 模块定义信息
     */
    static addLocalModule(name, moduleInfo) {
        const definition = DependenceService.getCurrentDependenceInfo();
        definition[name] = moduleInfo;
        fs.writeFileSync(
            path.resolve(SystemUtils.externalBasePath(), "libs.json"),
            JSON.stringify(definition, null, 2)
        );
    }
    /**
     * 获取远程模块定义
     * @param {string} name 模块名
     * @throws {RemoteDependenceDefinitionFileNotFoundError}
     * @throws {RemoteModuleNotFoundError}
     */
    static getRemoteModuleInfo(name) {
        const definition = DependenceService.getRemoteDependenceInfo();
        if (!definition[name]) {
            throw new RemoteModuleNotFoundError(`未定义的远程模块: ${name}`);
        }
        return definition[name];
    }
    /**
     * 获得模块文件列表（远程定义）
     * @param {string} name
     */
    static getRemoteModuleFiles(name, base) {
        const result = [];
        const moduleInfo = DependenceService.getRemoteModuleInfo(name);
        const getDirectoryFiles = (directory, path) => {
            for (const entry of directory.files) {
                if (entry.type === "file") {
                    result.push({
                        ...entry,
                        url: base + `${path}/${entry.name}`,
                        path: `${path}/${entry.name}`,
                    });
                } else if (entry.type === "directory") {
                    getDirectoryFiles(entry, `${path}/${entry.name}`);
                }
            }
        };
        getDirectoryFiles(moduleInfo, `/${name}`);
        return result;
    }
    /**
     * 从远程下载库定义
     * @param {string} base 远程仓库 base url
     */
    static async downloadRemoteLibraryDefinition(base) {
        try {
            const response = await axios({
                url: base + "/libs.json",
                method: "GET",
                responseType: "arraybuffer",
            });
            fs.writeFileSync(
                path.resolve(SystemUtils.externalBasePath(), "libs_remote.json"),
                Buffer.from(response.data)
            );
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
            throw new RemoteDependenceDefinitionDownloadError("下载远程仓库定义文件失败");
        }
    }
}

export default DependenceService;
