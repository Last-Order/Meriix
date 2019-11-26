<template>
  <v-container>
    <v-flex>
      <h3>依赖设置</h3>
      <v-row>
        <v-col cols="6">
          <v-form>
            <v-text-field label="外部依赖仓库地址 / 刷新后生效" v-model="remoteLibraryRepositoryUrl"></v-text-field>
            <v-btn text color="primary" @click="saveRemoteLibraryRepositoryUrl">保存</v-btn>
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
    <v-data-table :headers="headers" :items="dependencies" :search="search">
      <template v-slot:item.version="{ item }">
        <template v-if="item.type === 'local'">{{ item.version }}</template>
        <template v-else>未下载</template>
      </template>
      <template v-slot:item.remote_version="{ item }">
        {{ getRemoteModuleInfo(item.name).version }}
      </template>
      <template v-slot:item.operations="{ item }">
        <template v-if="item.type === 'local'">无可用操作</template>
        <template v-if="item.type === 'remote'">
          <v-btn text>下载</v-btn>
        </template>
      </template>
    </v-data-table>
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
          text: "本地版本号",
          value: "version"
        },
        {
          text: "远程版本号",
          value: "remote_version"
        },
        {
          text: "操作",
          value: "operations"
        }
      ],
      search: ""
    };
  },
  computed: {
    dependencies() {
      const result = [];
      const remoteDependenceInfo = DependenceService.getRemoteDependenceInfo();
      for (const key of Object.keys(this.dependenceInfo)) {
        result.push({
          ...this.dependenceInfo[key],
          name: key,
          type: "local"
        });
      }
      for (const key of Object.keys(remoteDependenceInfo).filter(k => !Object.keys(this.dependenceInfo).includes(k))) {
        result.push({
          ...remoteDependenceInfo[key],
          name: key,
          type: "remote"
        });
      }
      return result;
    },
    remoteLibraryRepositoryUrl: {
      get() {
        return this.$store.state.settings.dependence.remoteLibraryRepositoryUrl;
      },
      set(remoteLibraryRepositoryUrl) {
        if (remoteLibraryRepositoryUrl.endsWith("/")) {
          remoteLibraryRepositoryUrl = remoteLibraryRepositoryUrl.slice(
            0,
            remoteLibraryRepositoryUrl.length - 1
          );
        }
        this.$store.commit(
          "updateRemoteLibraryRepositoryUrl",
          remoteLibraryRepositoryUrl
        );
      }
    }
  },
  mounted() {
    this.dependenceInfo = DependenceService.getCurrentDependenceInfo();
  },
  methods: {
    async saveRemoteLibraryRepositoryUrl() {
      await DependenceService.downloadRemoteLibraryDefinition(
        this.remoteLibraryRepositoryUrl
      );
    },
    getRemoteModuleInfo(name) {
      return DependenceService.getRemoteModuleInfo(name);
    }
  }
};
</script>