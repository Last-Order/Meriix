<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ task.displayName || task.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ phase }}</v-list-item-subtitle>
      <v-progress-linear v-if="task.progress !== undefined" :value="task.progress"></v-progress-linear>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn text icon @click="viewLog(task.uuid)">
        <v-icon>mdi-file-document-box</v-icon>
      </v-btn>
      <v-btn v-if="task.category === 'unfinished'" text icon @click="killTask(task.uuid)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn v-if="task.category === 'finished'" text icon @click="openOutput(task.output)">
        <v-icon>mdi-folder</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
  props: ["task"],
  computed: {
    phase() {
      if (this.task.category === 'canceled') {
        return '已取消'
      }
      return this.task.phase || '准备中';
    }
  },
  methods: {
    viewLog(uuid) {
      this.$emit("viewLog", uuid);
    },
    killTask(uuid) {
      this.$emit('killTask', uuid);
    },
    openOutput(output) {
      this.$emit('openOutput', output);
    }
  }
};
</script>