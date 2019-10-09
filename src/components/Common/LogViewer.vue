<template>
  <div class="log-viewer-container" v-if="logs">
    <template v-for="(log, index) in logs">
      <div class="log-viewer-line" :key="index">{{ log.content }}</div>
    </template>
  </div>
</template>
<style>
.log-viewer-container {
  max-height: 350px;
  overflow-y: scroll;
}
.log-viewer-line {
  font-size: smaller;
}
</style>
<script>
export default {
  props: ["logs"]
};
</script>