<template>
    <div>
        <v-app light>
            <v-toolbar color="primary" density="compact">
                <v-toolbar-title>Meriix</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="settingsVisible = true">
                    <v-icon icon="mdi-cog-outline"></v-icon>
                </v-btn>
                <v-btn icon @click="queueDrawerVisible = true">
                    <v-icon icon="mdi-format-list-bulleted-square"></v-icon>
                </v-btn>
                <template v-slot:extension>
                    <v-tabs v-model="active" dark>
                        <v-tab key="quickAction" ripple>快速操作</v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <v-window v-model="active">
                <v-window-item key="quickAction">
                    <quick-action />
                    <div class="quick-action-tip">{{ quickActionTip }}</div>
                </v-window-item>
                <v-window-item key="videoEncode">
                    <video-encode />
                </v-window-item>
            </v-window>

            <v-navigation-drawer v-model="queueDrawerVisible" absolute temporary location="right" :width="400">
                <v-list-item>
                    <v-list-item-title>任务队列</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <task-queue />
            </v-navigation-drawer>
            <drop-helper :options="$store.state.global.dropHelperOptions" @dropped="droppedHandler" />
            <v-dialog v-model="showNewVersionTip">
                <new-version-tip :version="latestVersion" @close="showNewVersionTip = false" />
            </v-dialog>
            <v-dialog v-model="downloadVisible" width="70vw">
                <dependence-download />
            </v-dialog>
            <v-dialog v-model="settingsVisible" width="70vw">
                <settings />
            </v-dialog>
            <v-dialog v-if="!showNewVersionTip" v-model="remoteDependenceLibraryUrlSettingTipVisble" width="70vw">
                <v-card>
                    <v-card-title>提示</v-card-title>
                    <v-card-text>暂未设置远程依赖库地址，无法下载依赖，是否设置？</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn text color="#aaa" @click="
                            remoteDependenceLibraryUrlSettingTipVisble = false
                        ">以后再说</v-btn>
                        <v-btn text color="#aaa" @click="disableDependenceLibraryUrlSettingTip">不再提示</v-btn>
                        <v-btn text color="primary" @click="showSettings">设置</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="$store.state.error.show" color="error" :top="true" :timeout="50000">
                {{ $store.state.error.message }}
                <template v-slot:actions>
                    <v-btn color="white" variant="text" @click="$store.commit('hideError')">
                        ×
                    </v-btn>
                </template>
            </v-snackbar>
            <notification-center />
        </v-app>
    </div>
</template>
<style>
body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}

.v-application {
    background-color: #fff !important;
}

.quick-action-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: xx-large;
    height: calc(100vh - 122px);
    color: #aaa;
    user-select: none;
}
</style>
<script>
import { ipcRenderer } from "electron";
const log = require("electron-log");
import QuickAction from "@/components/QuickAction/Index.vue";
import VideoEncode from "@/components/VideoEncode/Index.vue";
import DropHelper from "@/components/Common/DropHelper.vue";
import TaskQueue from "@/components/TaskQueue/Index.vue";
import NotificationCenter from "@/components/NotificationCenter/Index.vue";
import NewVersionTip from "@/components/Common/NewVersionTip.vue";
import DependenceDownload from "@/components/Dependence/Download.vue";
import Settings from "@/components/Settings/Index.vue";
import Dependence from "@/services/dependence";
import Version from "@/services/version";
import Storage from "@/services/storage";
import DefaultEncoderPriority from "@/definitions/default_encoder_priority";

export default {
    name: "App",
    data: () => ({
        active: 0,
        showNewVersionTip: false,
        settingsVisible: false,
        remoteDependenceLibraryUrlSettingTipVisble: false,
        latestVersion: null,
        quickActionTip: "请稍等..",
        initialized: false,
    }),
    computed: {
        queueDrawerVisible: {
            get() {
                return this.$store.state.global.queueDrawerVisible;
            },
            set(visible) {
                this.$store.commit("setQueueDrawerVisible", visible);
            },
        },
        downloadVisible() {
            return this.$store.state.global.downloadVisible;
        },
    },
    async mounted() {
        // Check Available Encoders
        let availableEncoders = await ipcRenderer.invoke(
            "get-available-encoders"
        );
        const encoderPriority =
            this.$store.state.global.encoderPriority || DefaultEncoderPriority;
        availableEncoders = availableEncoders.sort(
            (a, b) => encoderPriority.indexOf(a) - encoderPriority.indexOf(b)
        );
        log.debug("检查编码器支持情况完成，可用：", availableEncoders);
        this.$store.commit("setAvailableEncoders", availableEncoders);
        this.quickActionTip = "将文件拖至此处";
        this.initialized = true;
        // Check Version
        try {
            const latestVersion = await Version.getLatestVersion();
            const localVersion = await ipcRenderer.invoke("get-version");
            const skippedVersions = Storage.getSetting("skippedVersions") || [];
            if (
                latestVersion.tag_name !== localVersion &&
                !skippedVersions.includes(latestVersion.tag_name)
            ) {
                this.latestVersion = latestVersion;
                this.showNewVersionTip = true;
                this.$store.commit("addSystemLog", {
                    type: "info",
                    content: "有新的版本可用",
                });
            }
        } catch (e) {
            this.$store.commit("showError", "检查最新版本失败");
            this.$store.commit("addSystemLog", {
                type: "error",
                content: "检查最新版本失败，请检查网络连接",
            });
        }
        // Check Remote Dependence Library
        if (!this.$store.state.settings.dependence.remoteLibraryRepositoryUrl) {
            if (
                !Storage.getSetting(
                    "others.disableDependenceLibraryUrlSettingTip"
                )
            ) {
                this.remoteDependenceLibraryUrlSettingTipVisble = true;
            }
        } else {
            try {
                await Dependence.downloadRemoteLibraryDefinition(
                    this.$store.state.settings.dependence
                        .remoteLibraryRepositoryUrl
                );
            } catch (e) {
                this.$store.commit("showError", e.message);
                this.$store.commit("addSystemLog", {
                    type: "error",
                    content: "更新远程依赖库信息失败，请检查网络连接",
                });
            }
        }
    },
    methods: {
        droppedHandler(e) {
            if (!this.initialized) {
                return this.$store.commit("showError", "主程序尚未初始化完毕");
            }
            this.$store.state.global.dropHandler(e);
        },
        showSettings() {
            this.remoteDependenceLibraryUrlSettingTipVisble = false;
            this.settingsVisible = true;
        },
        disableDependenceLibraryUrlSettingTip() {
            this.remoteDependenceLibraryUrlSettingTipVisble = false;
            Storage.setSetting(
                "others.disableDependenceLibraryUrlSettingTip",
                true
            );
        },
    },
    errorCaptured(err) {
        if (err.message) {
            this.$store.commit("addSystemLog", {
                type: "info",
                content: err.message,
            });
            this.$store.commit("showError", err.message);
            log.error(err);
        }
    },
    components: {
        QuickAction,
        VideoEncode,
        DropHelper,
        TaskQueue,
        NewVersionTip,
        Settings,
        DependenceDownload,
        NotificationCenter,
    },
};
</script>
