<template>
    <div class="log-viewer-container" v-if="logs" ref="container">
        <template v-for="(log, index) in logs" :key="index">
            <div class="log-viewer-line">{{ log.content }}</div>
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
    props: ["logs"],
    watch: {
        logs() {
            this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
        },
    },
};
</script>
