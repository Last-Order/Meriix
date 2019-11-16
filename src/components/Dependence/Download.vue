<template>
  <v-card>
    <v-card-title>依赖下载</v-card-title>
    <v-container>
      <v-flex v-if="step === 0">
        <v-row>
          <v-col>
            <p class="text-justify">要执行该功能，必须要下载以下模块，是否继续</p>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">模块名</th>
                    <th class="text-left">模块大小</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in modules" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ getRemoteModuleInfo(item.name).size | parseSize }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
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
      <v-btn text @click="cancel">取消</v-btn>
      <v-btn text color="primary" @click="download">确认</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import DependenceService from "@/services/dependence";
import Downloader from "@/services/download";
export default {
  data() {
    return {
      step: 0
    };
  },
  computed: {
    nowDownloadingNames() {
      return this.$store.state.download.nowDownloadingNames;
    },
    nowDownloadingPercent() {
      return this.$store.state.download.nowDownloadingPercent;
    },
    modules() {
      return this.$store.state.download.nowDownloadingNames.map(name => {
        return {
          name
        };
      });
    }
  },
  watch: {
    nowDownloadingNames() {
      this.step = 0;
    }
  },
  methods: {
    getRemoteModuleInfo(name) {
      try {
        return DependenceService.getRemoteModuleInfo(name);
      } catch (e) {
        this.$store.commit("showError", e);
      }
    },
    download() {
      const downloader = new Downloader(this.nowDownloadingNames, this.$store.state.settings.dependence.remoteLibraryRepositoryUrl);
      console.log(downloader.getDownloadFiles());
      this.step = 1;
    },
    cancel() {
      this.$store.commit("setDownloadVisible", false);
    }
  },
  filters: {
    parseSize(size) {
      return (size / 1024 / 1024).toFixed(2) + 'MB';
    }
  },
  mounted() {}
};
</script>