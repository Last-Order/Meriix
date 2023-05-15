<template>
    <v-container>
        <v-list>
            <v-list-item>
                Meriix {{ version }}
                <a href="https://github.com/Last-Order/Meriix" target="_blank">https://github.com/Last-Order/Meriix</a>
            </v-list-item>
            <v-list-item>
                Open-sourced under GPLv3. © 2019-2021, Eridanus Sora, member of MeowSound Idols.
            </v-list-item>
        </v-list>
        <div class="actions">
            <v-btn color="error" tile @click="openDevTools" class="open-devtools-button">打开开发者工具</v-btn>
            <v-btn tile @click="openLogDirectory" class="open-log-button">查看日志文件</v-btn>
        </div>
    </v-container>
</template>
<style lang="scss" scoped>
.open-log-button {
    margin-left: 8px;
}
</style>
<script>
import { ipcRenderer, shell } from "electron";
const log = require("electron-log")
export default {
    data() {
        return {
            version: "",
        };
    },
    async mounted() {
        this.version = await ipcRenderer.invoke("get-version");
    },
    methods: {
        openDevTools() {
            ipcRenderer.invoke("open-devtools");
        },
        openLogDirectory() {
            shell.showItemInFolder(log.transports.file.getFile().path);
        },
    },
};
</script>
