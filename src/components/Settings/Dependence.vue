<template>
  <v-container>
    <v-flex>
      <h3>依赖设置</h3>
      <v-row>
        <v-col cols="6">
          <v-form>
            <v-text-field label="外部依赖仓库地址" v-model="remoteLibraryRepositoryUrl"></v-text-field>
            <v-btn text color="primary">保存</v-btn>
          </v-form>
        </v-col>
      </v-row>
      <h3>依赖列表</h3>
      <v-row>
        <v-spacer />
        <v-col cols="4">
          <v-text-field v-model="search" label="搜索" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
    </v-flex>
    <v-data-table :headers="headers" :items="dependencies" :search="search"></v-data-table>
  </v-container>
</template>
<script>
import DependenceService from "@/services/dependence";
export default {
  data() {
    return {
      dependenceInfo: {},
      headers: [
        {
          text: "依赖项",
          value: "name"
        },
        {
          text: "版本号",
          value: "version"
        }
      ],
      search: ""
    };
  },
  computed: {
    dependencies() {
      const result = [];
      for (const key of Object.keys(this.dependenceInfo)) {
        result.push({
          ...this.dependenceInfo[key],
          name: key
        });
      }
      return result;
    },
    remoteLibraryRepositoryUrl: {
      get() {
        return this.$store.state.settings.dependence.remoteLibraryRepositoryUrl;
      },
      set(remoteLibraryRepositoryUrl) {
        this.$store.commit('updateRemoteLibraryRepositoryUrl', remoteLibraryRepositoryUrl);
      }
    }
  },
  mounted() {
    this.dependenceInfo = DependenceService.getCurrentDependenceInfo();
  }
};
</script>