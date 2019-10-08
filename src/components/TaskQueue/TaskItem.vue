<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ task.displayName || task.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ task.phase || '准备中' }}</v-list-item-subtitle>
      <v-progress-linear v-if="task.progress !== undefined" value="15"></v-progress-linear>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn text>
        日志
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
    props: ['task']
}
</script>