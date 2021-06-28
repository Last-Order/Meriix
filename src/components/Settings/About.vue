<template>
    <v-container>
        <v-layout>
            <v-flex>
                <div>
                    Meriix {{ version }}
                    <a href="https://github.com/Last-Order/Meriix" target="_blank"
                        >https://github.com/Last-Order/Meriix</a
                    >
                </div>
                <div>
                    Open-sourced under GPLv3. © 2019-2021, Eridanus Sora, member of MeowSound Idols.
                </div>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex>
                <v-btn color="error" tile @click="openDevTools" class="open-devtools-button"
                    >打开开发者工具</v-btn
                >
                <v-btn tile @click="openLogDirectory" class="open-log-button">查看日志文件</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<style lang="scss" scoped>
.open-devtools-button {
    margin-top: 4px;
}
.open-log-button {
    margin-top: 4px;
    margin-left: 8px;
}
</style>
<script>
import { ipcRenderer, shell } from "electron";
import log from 'electron-log';
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
        }
    },
};
</script>
