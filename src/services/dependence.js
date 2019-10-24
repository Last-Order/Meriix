import SystemUtils from '@/utils/system';
const fs = require('fs');
const path = require('path');
class DependenceService {
    static getCurrentDependenceInfo() {
        const dependenceInfoFile = path.resolve(SystemUtils.externalBasePath(), 'libs.json');
        return JSON.parse(fs.readFileSync(dependenceInfoFile).toString());
    }
}

export default DependenceService;