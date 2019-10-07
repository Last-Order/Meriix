import isDev from '@/utils/isDev';
const path = require('path');

export default {
    externalBasePath() {
        if (isDev) {
            return path.resolve(process.cwd(), 'lib');
        } else {
            return path.resolve(process.resourcesPath, 'lib');
        }
    }
}