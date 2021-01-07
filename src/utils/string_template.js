export default function template(string, keys) {
    let result = string;
    for (const key of Object.keys(keys)) {
        const regExp = new RegExp("\\${" + key + "}", "ig");
        result = result.replace(regExp, keys[key].toString());
    }
    return result;
}
