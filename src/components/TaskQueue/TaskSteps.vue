<template>
    <div>
        <v-stepper vertical>
            <template v-for="(step, index) in steps">
                <v-stepper-step :complete="current > index" :step="index" :key="step.uuid">
                    <div class="step-name">{{ step.stepName || getStepTypeName(step.type) }}</div>
                    <v-progress-linear
                        v-if="task.progress !== undefined && current == index"
                        :value="task.progress"
                    ></v-progress-linear>
                </v-stepper-step>
            </template>
        </v-stepper>
    </div>
</template>
<style lang="scss">
.v-stepper {
    box-shadow: none;
}
.v-stepper__label {
    width: 100%;
}
.step-name {
    width: 100%;
    margin-bottom: 8px;
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
