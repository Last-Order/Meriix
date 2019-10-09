import isDev from '@/utils/is_dev';
const path = require('path');
const fs = require('fs');

export default {
    /**
     * 外部二进制文件根目录
     */
    externalBasePath() {
        if (isDev) {
            return path.resolve(process.cwd(), 'lib');
        } else {
            return path.resolve(process.resourcesPath, 'lib');
        }
    },
    fillPlaceholders(command) {
        let result = command;
        const libInfo = JSON.parse(fs.readFileSync(path.resolve(this.externalBasePath(), 'libs.json')).toString());
        const placeholderNames = [];
        for (const match of command.matchAll(/\${(.+?)}/ig)) {
            placeholderNames.push(match[1]);
        }
        for (const name of placeholderNames) {
            if (libInfo[name]) {
                result = result.replace('${' + name + '}', path.resolve(this.externalBasePath(), libInfo[name].path));
            }
        }
        return result;
    }
}