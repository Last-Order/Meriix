const iconv = require('iconv-lite');
export function decode(str, binaryEncoding, textEncoding) {
    return iconv.decode(Buffer.from(str, binaryEncoding), textEncoding);
}