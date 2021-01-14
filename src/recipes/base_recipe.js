export default class BaseRecipe {
    /** 规则基本信息定义 */
    static get definition() {
        return {
            id: "base_recipe",
            name: "名称",
            description: "描述",
            encoderWhitelist: [],
            dependencies: [],
            version: '1.0.0',
        };
    }
    /**
     * 检测规则是否可以应用
     * @param {FileList} files 文件列表
     * @return {boolean}
     */
    static check(files) {
        return files.length > 0;
    }

    /**
     * 生成任务
     * @param {FileList} files
     */
    // eslint-disable-next-line no-unused-vars
    static generateTasks(files) {
        return [];
    }
}
