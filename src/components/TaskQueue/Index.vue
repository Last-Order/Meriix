<template>
  <v-list two-line class="task-queue-container">
    <v-tabs v-model="activeTab" fixed-tabs>
      <v-tab key="unfinished">未完成</v-tab>
      <v-tab key="finished">已完成</v-tab>
      <v-tab key="canceled">已取消</v-tab>
      <v-tabs-items v-model="activeTab">
        <v-tab-item key="unfinished">
          <task-list :tasks="$store.state.queue.tasks.filter(t => t.category === 'unfinished')"></task-list>
        </v-tab-item>
        <v-tab-item key="finished">
          <task-list :tasks="$store.state.queue.tasks.filter(t => t.category === 'finished')"></task-list>
        </v-tab-item>
        <v-tab-item key="canceled">
          <task-list :tasks="$store.state.queue.tasks.filter(t => t.category === 'canceled')"></task-list>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-list>
</template>
<script>
import TaskList from "./TaskList";
export default {
  data() {
    return {
      activeTab: 0
    };
  },
  components: {
    TaskList
  }
};
</script>