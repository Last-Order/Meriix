const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const basePath = path.resolve(__dirname, '../lib');
const libsInfo = JSON.parse(fs.readFileSync(path.resolve(basePath, 'libs.json')).toString());

const hashDirectory = (directoryPath) => {
    const directory = fs.readdirSync(directoryPath);
    const files = [];
    let hashes = '';
    let size = 0;
    for (const item of directory) {
        const fileStat = fs.statSync(path.resolve(directoryPath, item));
        if (fileStat.isDirectory()) {
            const subDirectoryHash = hashDirectory(path.resolve(directoryPath, item));
            size += subDirectoryHash.size;
            files.push({
                type: 'directory',
                name: item,
                ...subDirectoryHash,
            });
        } else {
            const hash = hashFile(path.resolve(directoryPath, item));
            hashes += hash;
            size += fileStat.size;
            console.log(`Hash file: ${path.dirname(directoryPath)}/${item} -> ${hash}; Size: ${fileStat.size}`);
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
    const directoryBase = path.resolve(basePath, libsInfo[key].directory);
    libsInfo[key] = {
        ...libsInfo[key],
        ...hashDirectory(directoryBase)
    };
}

fs.writeFileSync(path.resolve(basePath, 'libs.json'), JSON.stringify(libsInfo, null, 2));
console.log('Create lib definition file succeeded.');