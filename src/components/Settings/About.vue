<template>
  <v-container>
    <v-layout>
      <v-flex>
        <div>
          Meriix {{ version }}
          <a
            href="https://github.com/Last-Order/Meriix"
            target="_blank"
          >https://github.com/Last-Order/Meriix</a>
        </div>
        <div>Open-sourced under GPLv3. © 2019, Eridanus Sora, member of MeowSound Idols.</div>
      </v-flex>
    </v-layout>
    <v-layout>
        <v-flex>
            <v-btn color="error" text @click="openDevTools">打开开发者工具</v-btn>
        </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { remote } from 'electron'
import Version from "@/services/version";
export default {
  data() {
    return {
      version: ""
    };
  },
  mounted() {
    this.version = Version.getLocalVersion();
  },
  methods: {
      openDevTools() {
          remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
      }
  }
};
</script>