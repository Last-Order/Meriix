<template>
  <div>
    <v-app>
      <v-tabs v-model="active" color="cyan" dark slider-color="yellow">
        <v-tab key="videoEncode" ripple>视频编码</v-tab>
        <v-tab-item key="videoEncode">
          <v-card flat>
            <video-encode />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-app>
    <drop-helper :options="$store.state.global.dropHelperOptions" />
  </div>
</template>

<script>
import VideoEncode from "@/components/VideoEncode/Index";
import DropHelper from "@/components/Common/DropHelper";
export default {
  name: "App",
  data: () => ({
    active: 0
  }),
  components: {
    VideoEncode,
    DropHelper
  }
};
</script>
