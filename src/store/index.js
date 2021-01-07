import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import queue from "./modules/queue";
import error from "./modules/error";
import settings from "./modules/settings";
import download from "./modules/download";
import notification from "./modules/notification";

Vue.use(Vuex);

export default new Vuex.Store({
    mutations: {},
    actions: {},
    modules: {
        global,
        queue,
        error,
        settings,
        download,
        notification,
    },
});
