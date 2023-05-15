<template>
    <v-list two-line class="task-queue-container">
        <v-tabs v-model="activeTab" fixed-tabs>
            <v-tab key="unfinished">未完成</v-tab>
            <v-tab key="finished">已完成</v-tab>
            <v-tab key="canceled">已取消</v-tab>

        </v-tabs>
        <v-window v-model="activeTab">
            <v-window-item key="unfinished">
                <task-list :tasks="
                    $store.state.queue.tasks.filter(
                        (t) => t.category === 'unfinished'
                    )
                "></task-list>
            </v-window-item>
            <v-window-item key="finished">
                <task-list :tasks="
                    $store.state.queue.tasks.filter(
                        (t) => t.category === 'finished'
                    )
                "></task-list>
            </v-window-item>
            <v-window-item key="canceled">
                <task-list :tasks="
                    $store.state.queue.tasks.filter(
                        (t) => t.category === 'canceled'
                    )
                "></task-list>
            </v-window-item>
        </v-window>
    </v-list>
</template>
<script>
import TaskList from "./TaskList.vue";
export default {
    data() {
        return {
            activeTab: 0,
        };
    },
    components: {
        TaskList,
    },
};
</script>
