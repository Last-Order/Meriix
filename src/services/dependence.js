import SystemUtils from '@/utils/system';
const fs = require('fs');
const path = require('path');
class RemoteDependenceDefinitionFileNotFoundError extends Error {}
class RemoteModuleNotFoundError extends Error {}
class DependenceService {
    static getCurrentDependenceInfo() {
        const dependenceInfoFile = path.resolve(SystemUtils.externalBasePath(), 'libs.json');
        return JSON.parse(fs.readFileSync(dependenceInfoFile).toString());
    }
    static getLocalModuleInfo(name) {
        return DependenceService.getCurrentDependenceInfo[name];
    }
    /**
     * 获取远程模块定义
     * @param {*} name 
     * @throws {RemoteDependenceDefinitionFileNotFoundError}
     * @throws {RemoteModuleNotFoundError}
     */
    static getRemoteModuleInfo(name) {
        const remoteLibDefinitionPath = path.resolve(SystemUtils.externalBasePath(), 'libs_rem1ote.json');
        if (!fs.existsSync(remoteLibDefinitionPath)) {
            throw new RemoteDependenceDefinitionFileNotFoundError('远程依赖库定义不存在，请设定远程依赖库地址');
        }
        const definition = JSON.parse(fs.readFileSync(remoteLibDefinitionPath).toString());
        if (!definition[name]) {
            throw new RemoteModuleNotFoundError('未定义的远程模块');
        }
        return definition[name];
    }
}

export default DependenceService;