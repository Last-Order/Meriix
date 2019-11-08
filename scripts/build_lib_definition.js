const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const basePath = path.resolve(__dirname, '../lib');
const libsInfo = JSON.parse(fs.readFileSync(path.resolve(basePath, 'libs.json')).toString());

const hashFolder = (folderPath) => {
    const folder = fs.readdirSync(folderPath);
    const files = [];
    let hashes = '';
    for (const item of folder) {
        const fileStat = fs.statSync(path.resolve(folderPath, item));
        if (fileStat.isDirectory()) {
            files.push({
                type: 'directory',
                name: item,
                ...hashFolder(path.resolve(folderPath, item)),
            });
        } else {
            const hash = hashFile(path.resolve(folderPath, item));
            hashes += hash;
            console.log(`Hash file: ${path.dirname(folderPath)}/${item} -> ${hash}`);
            files.push({
                type: 'file',
                name: item,
                hash
            });
        }
    }
    return {
        hash: crypto.createHash('sha1').update(hashes).digest('hex'),
        files
    }
}

const hashFile = (path) => {
    return crypto.createHash('sha1').update(fs.readFileSync(path)).digest('hex');
}

for (const key of Object.keys(libsInfo)) {
    const folderBase = path.resolve(basePath, libsInfo[key].folder);
    libsInfo[key] = {
        ...libsInfo[key],
        ...hashFolder(folderBase)
    };
}

fs.writeFileSync(path.resolve(basePath, 'libs.json'), JSON.stringify(libsInfo, null, 2));
console.log('Create lib definition file succeeded.');