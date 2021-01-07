<template>
    <div>
        <v-stepper vertical>
            <template v-for="(step, index) in steps">
                <v-stepper-step :complete="current > index" :step="index + 1" :key="step.uuid">
                    {{ getStepTypeName(step.type) }}
                </v-stepper-step>
                <v-stepper-content :step="index + 1" :key="step.uuid">
                    {{ step.stepName }}
                    <v-progress-linear
                        v-if="task.progress !== undefined"
                        :value="task.progress"
                    ></v-progress-linear>
                </v-stepper-content>
            </template>
        </v-stepper>
    </div>
</template>
<style scoped>
.v-stepper {
    box-shadow: none;
}
</style>
<script>
export default {
    props: ["current", "steps", "task"],
    methods: {
        getStepTypeName(type) {
            const mapping = {
                function: "自定义函数",
                encode: "编码",
                pipe_encode: "经由管道编码",
                mux: "混流",
                delete: "删除文件",
                execute: "执行命令",
            };
            return mapping[type];
        },
    },
};
</script>
