<template>
    <v-card>
        <v-card-title>
            <span class="headline">版本更新提示</span>
        </v-card-title>
        <v-card-text>
            <div>新版本：{{ version && version.tag_name }} 可供更新</div>
            <div v-if="version && version.body">
                更新内容：
                <br />
                <markdown-it-vue class="version-content" :content="version.body" />
            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn text color="#aaa" @click="remindLater">稍后提醒</v-btn>
            <v-btn text color="#aaa" @click="skipVersion">跳过本版本</v-btn>
            <v-btn text color="primary" @click="downloadNewVersion">下载新版本</v-btn>
        </v-card-actions>
    </v-card>
</template>
<style lang="scss" scoped>
.version-content {
    max-height: 45vh;
    overflow-y: scroll;
}
</style>
<script>
const shell = require("electron").shell;
import Storage from "@/services/storage";
import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
export default {
    props: ["version"],
    methods: {
        skipVersion() {
            if (this.version) {
                const skippedVersions = Storage.getSetting("skippedVersions") || [];
                if (!skippedVersions.includes(this.version.tag_name)) {
                    skippedVersions.push(this.version.tag_name);
                }
                Storage.setSetting("skippedVersions", skippedVersions);
            }
            this.$emit("close");
        },
        remindLater() {
            this.$emit("close");
        },
        downloadNewVersion() {
            shell.openExternal("https://github.com/Last-Order/Meriix/releases");
        },
    },
    components: {
        MarkdownItVue,
    },
};
</script>
