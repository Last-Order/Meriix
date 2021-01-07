import axios from "axios";
export default class Version {
    static async getLatestVersion() {
        return (await axios.get("https://api.github.com/repos/Last-Order/Meriix/releases/latest"))
            .data;
    }
}
