import { createStore } from "vuex";
import global from "./modules/global";
import queue from "./modules/queue";
import error from "./modules/error";
import settings from "./modules/settings";
import download from "./modules/download";
import notification from "./modules/notification";

const store = createStore({
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

export default store;
