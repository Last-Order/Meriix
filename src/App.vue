<template>
  <div>
    <v-app light>
      <v-tabs v-model="active" dark>
        <v-tab key="quickAction" ripple>快速操作</v-tab>
        <!-- <v-tab key="videoEncode" ripple>视频编码</v-tab> -->
        <div class="flex-grow-1"></div>
        <v-btn icon height="48px" width="48px" @click="settingsVisible = true">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
        <v-btn icon height="48px" width="48px" @click="queueDrawerVisible = true">
          <v-icon>mdi-format-list-bulleted-square</v-icon>
        </v-btn>
        <v-tabs-items v-model="active">
          <v-tab-item key="quickAction">
            <quick-action />
          </v-tab-item>
          <v-tab-item key="videoEncode">
            <video-encode />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-navigation-drawer v-model="queueDrawerVisible" absolute temporary right width="400px">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>任务队列</v-list-item-title>
          </v-list-item-content>
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
      <v-dialog v-model="remoteDependenceLibraryUrlSettingTipVisble" width="70vw">
        <v-card>
          <v-card-title>提示</v-card-title>
          <v-card-text>暂未设置远程依赖库地址，无法下载依赖，是否设置？</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="remoteDependenceLibraryUrlSettingTipVisble = false">以后再说</v-btn>
            <v-btn text color="primary" @click="showSettings">设置</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="$store.state.error.show" color="error" :top="true" :timeout="50000">
        {{ $store.state.error.message }}
        <v-btn dark text @click="$store.commit('hideError')">×</v-btn>
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
</style>
<script>
import QuickAction from "@/components/QuickAction/Index";
import VideoEncode from "@/components/VideoEncode/Index";
import DropHelper from "@/components/Common/DropHelper";
import TaskQueue from "@/components/TaskQueue/Index";
import NotificationCenter from "@/components/NotificationCenter/Index";
import NewVersionTip from "@/components/Common/NewVersionTip";
import DependenceDownload from "@/components/Dependence/Download";
import Settings from "@/components/Settings/Index";
import Dependence from "@/services/dependence";
import Version from "@/services/version";
import Storage from "@/services/storage";

export default {
  name: "App",
  data: () => ({
    active: 0,
    showNewVersionTip: false,
    settingsVisible: false,
    remoteDependenceLibraryUrlSettingTipVisble: false,
    latestVersion: null
  }),
  computed: {
    queueDrawerVisible: {
      get() {
        return this.$store.state.global.queueDrawerVisible;
      },
      set(visible) {
        this.$store.commit("setQueueDrawerVisible", visible);
      }
    },
    downloadVisible() {
      return this.$store.state.global.downloadVisible;
    }
  },
  async mounted() {
    // Check Version
    try {
      const latestVersion = await Version.getLatestVersion();
      const localVersion = Version.getLocalVersion();
      const skippedVersions = Storage.getSetting("skippedVersions") || [];
      if (
        latestVersion.tag_name !== localVersion &&
        !skippedVersions.includes(latestVersion.tag_name)
      ) {
        this.latestVersion = latestVersion;
        this.showNewVersionTip = true;
        this.$store.commit("addSystemLog", {
          type: "info",
          content: "有新的版本可用"
        });
      }
    } catch (e) {
      this.$store.commit("showError", "检查最新版本失败");
      this.$store.commit("addSystemLog", {
        type: "error",
        content: "检查最新版本失败，请检查网络连接"
      });
    }
    // Check Remote Dependence Library
    if (!this.$store.state.settings.dependence.remoteLibraryRepositoryUrl) {
      this.remoteDependenceLibraryUrlSettingTipVisble = true;
    } else {
      try {
        await Dependence.downloadRemoteLibraryDefinition(
          this.$store.state.settings.dependence.remoteLibraryRepositoryUrl
        );
      } catch (e) {
        this.$store.commit("showError", e.message);
        this.$store.commit("addSystemLog", {
          type: "error",
          content: "更新远程依赖库信息失败，请检查网络连接"
        });
      }
    }
  },
  methods: {
    droppedHandler(e) {
      this.$store.state.global.dropHandler(e);
    },
    showSettings() {
      this.remoteDependenceLibraryUrlSettingTipVisble = false;
      this.settingsVisible = true;
    }
  },
  errorCaptured(err) {
    if (err.message) {
      this.$store.commit("addSystemLog", {
        type: "info",
        content: err.message
      });
      this.$store.commit("showError", err.message);
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
    NotificationCenter
  }
};
</script>
