<template>
    <div>
        <v-card>
            <v-card-title>下载依赖</v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="dependencies" :search="search">
                    <template v-slot:item.version="{ item }">
                        {{ getLocalVersion(item.name) || "未安装" }}
                    </template>
                    <template v-slot:item.remote_version="{ item }">
                        {{ item.version || "不适用" }}
                    </template>
                    <template v-slot:item.operations="{ item }">
                        <template v-if="getLocalVersion(item.name) !== item.version">
                            <v-btn text @click="downloadModule(item.name)">下载</v-btn>
                        </template>
                        <template v-else> 无可用操作 </template>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import DependenceService from "@/services/dependence";
export default {
    data() {
        return {
            localDependenceInfo: {},
            remoteDependenceInfo: {},
            headers: [
                {
                    text: "依赖项",
                    value: "name",
                },
                {
                    text: "本地版本号",
                    value: "version",
                },
                {
                    text: "远程版本号",
                    value: "remote_version",
                    sortable: false,
                },
                {
                    text: "操作",
                    value: "operations",
                    sortable: false,
                },
            ],
        };
    },
    computed: {
        dependencies() {
            const result = [];
            for (const key of Object.keys(this.remoteDependenceInfo)) {
                result.push({
                    ...this.remoteDependenceInfo[key],
                    name: key,
                    type: "local",
                });
            }
            return result;
        },
    },
    mounted() {
        this.localDependenceInfo = DependenceService.getCurrentDependenceInfo();
        this.remoteDependenceInfo = DependenceService.getRemoteDependenceInfo();
    },
    methods: {
        getLocalVersion(moduleName) {
            return this.localDependenceInfo?.[moduleName]?.version;
        },
        downloadModule(name) {
            const { commit } = this.$store;
            commit("setNowDownloadingNames", [name]);
            commit("setDownloadVisible", true);
            commit("setNowDownloadingPercent", 0);
            commit("setTasksAfterDownload", []);
            commit("setCallbackAfterDownload", () => {
                // refresh table
                this.localDependenceInfo = DependenceService.getCurrentDependenceInfo();
            });
        },
    },
};
</script>
