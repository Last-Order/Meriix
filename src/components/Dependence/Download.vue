<template>
  <v-card>
    <v-card-title>依赖下载</v-card-title>
    <v-container>
      <v-flex>
        <v-row justify="start">
          <v-col>{{ $store.state.download.nowDownloadingName }}</v-col>
          <v-spacer />
          <v-col class="text-right">50%</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-progress-linear :value="$store.state.download.nowDownloadingPercent"></v-progress-linear>
          </v-col>
        </v-row>
      </v-flex>
    </v-container>
  </v-card>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>