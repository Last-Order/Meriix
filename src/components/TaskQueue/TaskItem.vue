<template>
    <v-list-item>
        <v-list-item-title>{{ task.displayName || task.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ phase }}</v-list-item-subtitle>
        <v-progress-linear v-if="task.progress !== undefined" :value="task.progress"></v-progress-linear>
        <template v-slot:append>
            <v-btn variant="text" size="small" icon="mdi-text-box" @click="viewDetail(task.uuid)" />
            <v-btn variant="text" size="small" icon="mdi-close" v-if="task.category === 'unfinished'"
                @click="killTask(task.uuid)" />
            <v-btn variant="text" size="small" icon="mdi-folder" v-if="task.category === 'finished'"
                @click="openOutput(task.output)" />
        </template>
    </v-list-item>
</template>
<script>
export default {
    props: ["task"],
    computed: {
        phase() {
            if (this.task.category === "canceled") {
                return "已取消";
            }
            return this.task.phase || "准备中";
        },
    },
    methods: {
        viewDetail(uuid) {
            this.$emit("viewDetail", uuid);
        },
        killTask(uuid) {
            this.$emit("killTask", uuid);
        },
        openOutput(output) {
            this.$emit("openOutput", output);
        },
    },
};
</script>
