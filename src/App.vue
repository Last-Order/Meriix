<template>
  <div>
    <v-app>
      <v-tabs v-model="active" color="cyan" dark slider-color="yellow">
        <v-tab key="videoEncode" ripple>视频编码</v-tab>
        <v-tab-item key="videoEncode">
          <video-encode />
        </v-tab-item>
      </v-tabs>
    </v-app>
    <drop-helper :options="$store.state.global.dropHelperOptions" @dropped="droppedHandler" />
  </div>
</template>
<style>
body {
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
.v-tabs-items {
  background-color: rgba(250, 250, 250) !important;
}
</style>
<script>
import VideoEncode from "@/components/VideoEncode/Index";
import DropHelper from "@/components/Common/DropHelper";
export default {
  name: "App",
  data: () => ({
    active: 0
  }),
  methods: {
    droppedHandler(e) {
      this.$store.state.global.dropHandler(e);
    }
  },
  components: {
    VideoEncode,
    DropHelper
  }
};
</script>
