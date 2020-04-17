<template>
  <div class="task-list">
    <template v-for="task in tasks">
      <task-item :key="task.uuid" :task="task" @viewDetail="viewDetail" @killTask="killTask" @openOutput="openOutput" />
    </template>
    <v-dialog v-model="logViewerVisible" width="600">
      <v-card>
        <v-card-title>
          <span class="headline">任务详情</span>
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="activeTab" fixed-tabs v-if="uuid">
          <v-tab key="info">任务详情</v-tab>
          <v-tab key="log">输出日志</v-tab>
          <v-tabs-items v-model="activeTab">
            <v-tab-item key="info">
              <task-step :current="task.currentStepIndex" :steps="task.steps" :task="task"></task-step>
            </v-tab-item>
            <v-tab-item key="log">
              <log-viewer :logs="task.logs" />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
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
const { shell } = require('electron');
import LogViewer from '@/components/Common/LogViewer'
import TaskItem from './TaskItem';
import TaskStep from './TaskSteps';
export default {
  props: ["tasks"],
  data() {
    return {
      logViewerVisible: false,
      logs: [],
      steps: [],
      uuid: undefined,
      activeTab: 'log'
    };
  },
  computed: {
    task() {
      return this.$store.state.queue.tasks.find(t => t.uuid === this.uuid);
    }
  },
  methods: {
    viewDetail(uuid) {
      this.logViewerVisible = true;
      this.uuid = uuid;
    },
    killTask(uuid) {
      this.$store.dispatch("killTask", uuid);
    },
    openOutput(output) {
      if (output) {
        shell.showItemInFolder(output);
      }
    }
  },
  components: {
      LogViewer,
      TaskItem,
      TaskStep
  }
};
</script>