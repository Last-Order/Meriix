<template>
  <v-container>
    <v-data-table :headers="headers" :items="dependencies"></v-data-table>
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
      ]
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
    }
  },
  mounted() {
    this.dependenceInfo = DependenceService.getCurrentDependenceInfo();
  }
};
</script>