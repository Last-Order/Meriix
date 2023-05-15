<template>
    <v-container>
        <v-list subheader flat lines="two">
            <v-list-subheader>任务</v-list-subheader>
            <v-list-item>
                <template v-slot:prepend>
                    <v-list-item-action>
                        <v-checkbox-btn
                            v-model="deleteTemporaryFilesWhenCancelTasks"
                        />
                    </v-list-item-action>
                </template>

                <v-list-item-title>中断任务时删除中间文件</v-list-item-title>
                <v-list-item-subtitle
                    >取消任务时将会删除任务产生的中间临时文件</v-list-item-subtitle
                >
            </v-list-item>
        </v-list>
    </v-container>
</template>
<script>
export default {
    data() {
        return {};
    },
    computed: {
        deleteTemporaryFilesWhenCancelTasks: {
            get() {
                return this.$store.state.settings.general
                    .deleteTemporaryFilesWhenCancelTasks;
            },
            set(value) {
                this.$store.commit(
                    "updateDeleteTemporaryFilesWhenCancelTasks",
                    value
                );
            },
        },
    },
};
</script>
