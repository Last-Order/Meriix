const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const basePath = path.resolve(__dirname, '../lib');
const libsInfo = JSON.parse(fs.readFileSync(path.resolve(basePath, 'libs.json')).toString());

const hashFolder = (folderPath) => {
    const folder = fs.readdirSync(folderPath);
    const files = [];
    let hashes = '';
    let size = 0;
    for (const item of folder) {
        const fileStat = fs.statSync(path.resolve(folderPath, item));
        if (fileStat.isDirectory()) {
            const subDirectoryHash = hashFolder(path.resolve(folderPath, item));
            size += subDirectoryHash.size;
            files.push({
                type: 'directory',
                name: item,
                ...subDirectoryHash,
            });
        } else {
            const hash = hashFile(path.resolve(folderPath, item));
            hashes += hash;
            size += fileStat.size;
            console.log(`Hash file: ${path.dirname(folderPath)}/${item} -> ${hash}; Size: ${fileStat.size}`);
            files.push({
                type: 'file',
                name: item,
                hash,
                size
            });
        }
    }
    return {
        hash: crypto.createHash('sha1').update(hashes).digest('hex'),
        files,
        size
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