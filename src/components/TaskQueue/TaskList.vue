<template>
  <div class="task-list">
    <template v-for="task in tasks">
      <task-item :key="task.uuid" :task="task" @viewLog="viewLog" @killTask="killTask" />
    </template>
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
  </div>
</template>
<script>
import LogViewer from '@/components/Common/LogViewer'
import TaskItem from './TaskItem';
export default {
  props: ["tasks"],
  data() {
    return {
      logViewerVisible: false,
      logs: []
    };
  },
  methods: {
    viewLog(uuid) {
      this.logViewerVisible = true;
      this.logs = this.$store.state.queue.tasks.find(t => t.uuid === uuid).logs;
    },
    killTask(uuid) {
      this.$store.dispatch("killTask", uuid);
    }
  },
  components: {
      LogViewer,
      TaskItem
  }
};
</script>