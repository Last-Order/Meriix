<template>
    <div class="notification-center-container">
        <v-row justify="center">
            <v-col lg="11" class="message-preview">{{
                logs.length > 0 ? logs[0].content : ""
            }}</v-col>
            <v-col lg="1" class="expand-button">
                <v-spacer />
                <v-icon color="white" @click="toggleLogWindowVisible">{{
                    logWindowVisible ? "mdi-chevron-down" : "mdi-chevron-up"
                }}</v-icon>
            </v-col>
        </v-row>
        <v-row v-if="logWindowVisible">
            <v-col class="main">
                <template v-for="log in logs">
                    <div :key="log.time" :class="logClassNames(log)">
                        [{{ new Date(log.time).toLocaleString() }}] {{ log.content }}
                    </div>
                </template>
            </v-col>
        </v-row>
    </div>
</template>
<style lang="scss" scoped>
.notification-center-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgb(66, 66, 66);
    &.hide-log-window {
        height: 1.8rem;
    }
    &.show-hide-window {
        height: 4.8rem;
    }
    .message-preview {
        line-height: 1.8rem;
        font-size: 0.8rem;
        color: white;
        padding-left: 1.2rem;
    }
    .expand-button {
        display: flex;
        line-height: 1.8rem;
        padding: 0;
        padding-right: 1rem;
        i {
            cursor: pointer;
        }
    }
    .main {
        min-height: 7rem;
        background-color: white;
        .log-item {
            padding-left: 0.5rem;
            font-size: 0.8rem;
            &:hover {
                background-color: rgba(10, 10, 10, 0.05);
            }
            &.log-error {
                color: #ff5252;
            }
            &.log-warning {
                color: #fb8c00;
            }
            &.log-info {
                color: #aaa;
            }
        }
    }
}
</style>
<script>
export default {
    data() {
        return {
            logWindowVisible: false,
        };
    },
    computed: {
        logs() {
            return this.$store.state.notification.logs;
        },
    },
    methods: {
        toggleLogWindowVisible() {
            this.logWindowVisible = !this.logWindowVisible;
        },
        logClassNames(log) {
            return {
                "log-item": true,
                ["log-" + log.type]: true,
            };
        },
    },
};
</script>
