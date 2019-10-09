<template>
  <div>
    <v-app>
      <v-tabs v-model="active" color="cyan" dark slider-color="yellow">
        <v-tab key="quickAction" ripple>快速操作</v-tab>
        <v-tab key="videoEncode" ripple>视频编码</v-tab>
        <div class="flex-grow-1"></div>
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
      <v-snackbar
        v-model="$store.state.error.show"
        color="error"
        :top="true"
        :timeout="50000"
      >
        {{ $store.state.error.message }}
        <v-btn dark text @click="$store.commit('hideError')">×</v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>
<style>
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.v-tabs-items {
  background-color: rgb(250, 250, 250) !important;
}
</style>
<script>
import QuickAction from "@/components/QuickAction/Index";
import VideoEncode from "@/components/VideoEncode/Index";
import DropHelper from "@/components/Common/DropHelper";
import TaskQueue from "@/components/TaskQueue/Index";

export default {
  name: "App",
  data: () => ({
    active: 0
  }),
  computed: {
    queueDrawerVisible: {
      get() {
        return this.$store.state.global.queueDrawerVisible;
      },
      set(visible) {
        this.$store.commit('setQueueDrawerVisible', visible);
      }
    }
  },
  methods: {
    droppedHandler(e) {
      this.$store.state.global.dropHandler(e);
    }
  },
  components: {
    QuickAction,
    VideoEncode,
    DropHelper,
    TaskQueue
  }
};
</script>