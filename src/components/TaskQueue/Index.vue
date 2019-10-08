<template>
  <v-list two-line class="task-queue-container">
      <template v-for="task in $store.state.queue.tasks">
          <task-item :key="task.id" :task="task" />
      </template>
  </v-list>
</template>
<script>
import TaskItem from './TaskItem';
export default {
  data() {
    return {};
  },
  components: {
      TaskItem
  }
};
</script>