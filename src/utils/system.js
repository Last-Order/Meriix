import isDev from '@/utils/isDev';
const path = require('path');
const { remote } = require('electron');

export default {
    externalBasePath() {
        if (isDev) {
            return path.resolve(remote.process.cwd(), 'lib');
        } else {
            return path.resolve(process.resourcesPath, 'lib');
        }
    }
}