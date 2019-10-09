<template>
  <v-list two-line class="task-queue-container">
    <template v-for="task in $store.state.queue.tasks">
      <task-item :key="task.uuid" :task="task" @viewLog="viewLog" />
    </template>
    <v-btn @click="go">Go!</v-btn>
    <v-dialog v-model="logViewerVisible" width="600">
      <v-card>
        <v-card-title>
          <span class="headline">日志</span>
        </v-card-title>
        <v-card-text>
          <log-viewer :logs="logs" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="logViewerVisible = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>
<script>
import LogViewer from "@/components/Common/LogViewer";
import TaskItem from "./TaskItem";
export default {
  data() {
    return {
      logViewerVisible: false,
      logs: []
    };
  },
  methods: {
    go() {
      this.$store.dispatch("runTask", this.$store.state.queue.tasks[0].uuid);
    },
    viewLog(uuid) {
      this.logViewerVisible = true;
      this.logs = this.$store.state.queue.tasks.find(t => t.uuid === uuid).logs;
    }
  },
  components: {
    TaskItem,
    LogViewer
  }
};
</script>