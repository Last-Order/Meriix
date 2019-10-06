<template>
  <div class="video-encode-container">
    <v-layout row wrap justify-center>
      <v-flex xs6>
        <v-card>
          <v-card-text>
            <v-form>
              <v-file-input v-model="form.video" label="视频文件" prepend-icon="mdi-video" />
              <v-file-input v-model="form.subtitle" label="字幕文件" prepend-icon="mdi-text" />
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dropHelperOptions: [],
      form: {
        video: undefined,
        subtitle: undefined
      }
    };
  },
  mounted() {
    this.$store.commit("setDropHelperOptions", [
      {
        name: "video",
        text: "视频"
      },
      {
        name: "subtitle",
        text: "字幕"
      }
    ]);
    this.$store.commit('setDropHandler', this.handleFileDropped);
  },
  methods: {
      handleFileDropped(event) {
          if (event.name === 'video') {
              this.form.video = event.files[0];
          }
          if (event.name === 'subtitle') {
              this.form.subtitle = event.files[0];
          }
      }
  }
};
</script>