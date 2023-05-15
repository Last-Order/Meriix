<template>
    <v-container>
        <v-list subheader>
            <v-list-subheader>依赖设置</v-list-subheader>
            <v-list-item>
                <v-form class="repository-form-container">
                    <v-text-field
                        label="外部依赖仓库地址 / 刷新后生效"
                        v-model="remoteLibraryRepositoryUrl"
                    ></v-text-field>
                    <v-btn
                        tile
                        color="primary"
                        @click="saveRemoteLibraryRepositoryUrl"
                    >
                        <template v-if="saveRemoteLibraryRepositoryUrlLoading">
                            <v-icon class="loading">mdi-loading</v-icon>
                        </template>
                        <template v-else>保存</template>
                    </v-btn>
                </v-form>
            </v-list-item>
            <div class="d-flex justify-space-between align-center">
                <v-list-subheader class="section-title"
                    >已安装依赖列表</v-list-subheader
                >
                <div v-if="remoteLibraryRepositoryUrl">
                    <v-btn @click="remoteDependencePanelVisible = true"
                        >从远端安装依赖</v-btn
                    >
                </div>
            </div>
            <v-list-item>
                <div class="d-flex" style="width: 100%">
                    <v-spacer />
                    <v-col cols="24">
                        <v-text-field
                            v-model="search"
                            label="搜索"
                            single-line
                            hide-details
                            density="compact"
                        ></v-text-field>
                    </v-col>
                </div>
            </v-list-item>
            <v-list-item>
                <v-data-table
                    :headers="headers"
                    :items="dependencies"
                    :search="search"
                    class="dependence-table"
                >
                    <template v-slot:item.remote_version="{ item }">
                        {{ getRemoteVersion(item.raw.name) || "不适用" }}
                    </template>
                    <template v-slot:item.operations="{ item }">
                        <template
                            v-if="
                                getRemoteVersion(item.raw.name) !==
                                item.raw.version
                            "
                        >
                            <v-btn
                                variant="text"
                                @click="downloadModule(item.raw.name)"
                                >下载</v-btn
                            >
                        </template>
                        <template v-else> 无可用操作 </template>
                    </template>
                </v-data-table>
            </v-list-item>
        </v-list>

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
.dependence-table {
    width: 100%;
}
</style>
<script>
import DependenceService from "@/services/dependence";
import RemoteDependence from "./RemoteDependence.vue";
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
                    title: "依赖项",
                    key: "name",
                },
                {
                    title: "本地版本号",
                    key: "version",
                },
                {
                    title: "远程版本号",
                    key: "remote_version",
                },
                {
                    title: "操作",
                    key: "operations",
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
            console.log(result);
            return result;
        },
        remoteLibraryRepositoryUrl: {
            get() {
                return this.$store.state.settings.dependence
                    .remoteLibraryRepositoryUrl;
            },
            set(remoteLibraryRepositoryUrl) {
                if (remoteLibraryRepositoryUrl.endsWith("/")) {
                    remoteLibraryRepositoryUrl =
                        remoteLibraryRepositoryUrl.slice(
                            0,
                            remoteLibraryRepositoryUrl.length - 1
                        );
                }
                this.$store.commit(
                    "updateRemoteLibraryRepositoryUrl",
                    remoteLibraryRepositoryUrl
                );
            },
        },
    },
    mounted() {
        this.dependenceInfo = DependenceService.getCurrentDependenceInfo();
        this.remoteDependenceInfo = DependenceService.getRemoteDependenceInfo();
    },
    methods: {
        async saveRemoteLibraryRepositoryUrl() {
            if (!this.remoteLibraryRepositoryUrl) {
                this.$store.commit("showError", "请输入合法地址");
            }
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
            if (
                this.remoteDependenceInfo &&
                this.remoteDependenceInfo[moduleName]
            ) {
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
                this.dependenceInfo =
                    DependenceService.getCurrentDependenceInfo();
            });
        },
    },
};
</script>
