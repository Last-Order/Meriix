<template>
  <v-card>
    <v-card-title>依赖下载</v-card-title>
    <v-container>
      <v-flex v-if="step === 0">
        <v-row>
          <v-col>
            <p>将要下载以下模块，是否继续</p>
            <v-data-table></v-data-table>
          </v-col>
        </v-row>
      </v-flex>
      <v-flex v-if="step === 1">
        <v-row justify="start">
          <v-col>{{ nowDownloadingNames }}</v-col>
          <v-spacer />
          <v-col class="text-right">50%</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-progress-linear :value="nowDownloadingPercent"></v-progress-linear>
          </v-col>
        </v-row>
      </v-flex>
    </v-container>
    <v-card-actions v-if="step === 0">
      <v-spacer />
      <v-btn text>取消</v-btn>
      <v-btn text color="primary">确认</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import DependenceService from "@/services/dependence";
export default {
  data() {
    return {
      step: 0
    };
  },
  computed: {
    nowDownloadingNames() {
      return this.$store.state.download.nowDownloadingName;
    },
    nowDownloadingPercent() {
      return this.$store.state.download.nowDownloadingPercent;
    },
    modules() {

    }
  },
  watch: {
    nowDownloadingNames() {
      this.step = 0;
    }
  },
  mounted() {
    try {
      console.log(DependenceService.getRemoteModuleInfo());
    } catch (e) {
      this.$store.commit("showError", e);
    }
  }
};
</script>