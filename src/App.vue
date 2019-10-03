<template>
  <v-app>
    <v-tabs
      v-model="active"
      color="cyan"
      dark
      slider-color="yellow"
    >
      <v-tab
        key="videoEncode"
        ripple
      >
        视频编码
      </v-tab>
      <v-tab-item
        key="videoEncode"
      >
        <v-card flat>
          <video-encode />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-app>
</template>

<script>
import VideoEncode from '@/components/VideoEncode/Index';
export default {
  name: 'App',
  data: () => ({
    active: 0
  }),
  components: {
    VideoEncode
  }
};
</script>
