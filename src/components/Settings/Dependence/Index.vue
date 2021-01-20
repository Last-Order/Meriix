<template>
    <v-container>
        <div class="d-flex flex-column">
            <h3 class="section-title">依赖设置</h3>
            <div class="d-flex">
                <v-form class="repository-form-container">
                    <v-text-field
                        label="外部依赖仓库地址 / 刷新后生效"
                        v-model="remoteLibraryRepositoryUrl"
                    ></v-text-field>
                    <v-btn text color="primary" @click="saveRemoteLibraryRepositoryUrl">
                        <template v-if="saveRemoteLibraryRepositoryUrlLoading">
                            <v-icon class="loading">mdi-loading</v-icon>
                        </template>
                        <template v-else>保存</template>
                    </v-btn>
                </v-form>
            </div>
            <div class="d-flex justify-space-between align-center">
                <h3 class="section-title">已安装依赖列表</h3>
                <div>
                    <v-btn @click="remoteDependencePanelVisible = true">从远端安装依赖</v-btn>
                </div>
            </div>
            <div class="d-flex">
                <v-spacer />

                <v-col cols="4">
                    <v-text-field
                        v-model="search"
                        label="搜索"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-col>
            </div>
        </div>
        <v-data-table :headers="headers" :items="dependencies" :search="search">
            <template v-slot:item.version="{ item }">
                {{ item.version }}
            </template>
            <template v-slot:item.remote_version="{ item }">
                {{ getRemoteVersion(item.name) || "不适用" }}
            </template>
            <template v-slot:item.operations="{ item }">
                <template v-if="getRemoteVersion(item.name) !== item.version">
                    <v-btn text @click="downloadModule(item.name)">下载</v-btn>
                </template>
                <template v-else> 无可用操作 </template>
            </template>
        </v-data-table>
        <v-dialog v-model="remoteDependencePanelVisible" width="70vw">
            <remote-dependence></remote-dependence>
        </v-dialog>
    </v-container>
</template>
<style scoped>
@keyframes loading {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.loading {
    animation: 1s loading 0s infinite;
}
.section-title {
    margin: 4px 0;
}
.repository-form-container {
    width: 50%;
    margin-bottom: 8px;
}
</style>
<script>
import DependenceService from "@/services/dependence";
import RemoteDependence from "./RemoteDependence";
export default {
    components: {
        RemoteDependence,
    },
    data() {
        return {
            dependenceInfo: {},
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
            search: "",
            saveRemoteLibraryRepositoryUrlLoading: false,
            remoteDependencePanelVisible: false,
        };
    },
    computed: {
        dependencies() {
            const result = [];
            for (const key of Object.keys(this.dependenceInfo)) {
                result.push({
                    ...this.dependenceInfo[key],
                    name: key,
                    type: "local",
                });
            }
            return result;
        },
        remoteLibraryRepositoryUrl: {
            get() {
                return this.$store.state.settings.dependence.remoteLibraryRepositoryUrl;
            },
            set(remoteLibraryRepositoryUrl) {
                if (remoteLibraryRepositoryUrl.endsWith("/")) {
                    remoteLibraryRepositoryUrl = remoteLibraryRepositoryUrl.slice(
                        0,
                        remoteLibraryRepositoryUrl.length - 1
                    );
                }
                this.$store.commit("updateRemoteLibraryRepositoryUrl", remoteLibraryRepositoryUrl);
            },
        },
    },
    mounted() {
        this.dependenceInfo = DependenceService.getCurrentDependenceInfo();
        this.remoteDependenceInfo = DependenceService.getRemoteDependenceInfo();
    },
    methods: {
        async saveRemoteLibraryRepositoryUrl() {
            this.saveRemoteLibraryRepositoryUrlLoading = true;
            try {
                await DependenceService.downloadRemoteLibraryDefinition(
                    this.remoteLibraryRepositoryUrl
                );
            } finally {
                this.saveRemoteLibraryRepositoryUrlLoading = false;
            }
        },
        getRemoteVersion(moduleName) {
            if (this.remoteDependenceInfo && this.remoteDependenceInfo[moduleName]) {
                return this.remoteDependenceInfo[moduleName].version;
            }
            return "";
        },
        downloadModule(name) {
            const { commit } = this.$store;
            commit("setNowDownloadingNames", [name]);
            commit("setDownloadVisible", true);
            commit("setNowDownloadingPercent", 0);
            commit("setTasksAfterDownload", []);
            commit("setCallbackAfterDownload", () => {
                // refresh table
                this.dependenceInfo = DependenceService.getCurrentDependenceInfo();
            });
        },
    },
};
</script>
