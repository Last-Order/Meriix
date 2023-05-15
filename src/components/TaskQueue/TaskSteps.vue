<template>
    <div class="task-steps-container">
        <template v-for="(step, index) in steps" :key="step.uuid">
            <div class="step-item" :class="{ upcoming: current <= index }">
                <div class="left">
                    <v-icon
                        class="status-icon"
                        color="#3f51b5"
                        v-if="current > index"
                        >mdi-check</v-icon
                    >
                    <v-icon
                        class="status-icon loading"
                        color="#3f51b5"
                        v-if="current === index"
                        >mdi-loading</v-icon
                    >
                    <v-icon
                        class="status-icon"
                        color="#3f51b5"
                        v-if="current < index"
                        >mdi-progress-clock</v-icon
                    >
                </div>
                <div class="right">
                    <div class="step-type">
                        {{ step.type && getStepTypeName(step.type) }}
                    </div>
                    <div class="step-name">{{ step.stepName }}</div>
                    <div
                        v-if="task.progress !== undefined && current == index"
                        class="progress-container"
                    >
                        <div class="progress-value">{{ task.progress }} %</div>
                        <v-progress-linear
                            :value="task.progress"
                        ></v-progress-linear>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<style lang="scss">
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.loading {
    animation: 1s spin 0s infinite;
}
.task-steps-container {
    width: 100%;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
}
.step-item {
    padding: 1rem 0;
    display: flex;
    border-left: 2px solid #3f51b5;
    &.upcoming {
        border-left: 2px solid #bdbdbd;
    }
}
.left {
    display: flex;
    width: 75px;
}
.status-icon {
    margin-left: 15px;
    color: #3f51b5;
}
.step-type {
    font-size: 16px;
    color: #263238;
}
.step-name {
    margin: 4px 0;
    font-size: 12px;
}
.right {
    flex-grow: 1;
}
.progress-container {
    position: relative;
}
.progress-value {
    position: absolute;
    right: 0;
    top: -24px;
    font-size: smaller;
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
