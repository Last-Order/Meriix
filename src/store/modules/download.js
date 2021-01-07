const state = {
    nowDownloadingNames: [],
    nowDownloadingPercent: 0,
    nowDownloadingPercentText: "",
    tasksAfterDownload: [],
    callbackAfterDownload: undefined,
};

const getters = {};
const actions = {};
const mutations = {
    setNowDownloadingNames: (state, name) => {
        state.nowDownloadingNames = name;
    },
    setNowDownloadingPercent: (state, percent) => {
        state.nowDownloadingPercent = percent;
    },
    setNowDownloadingPercentText: (state, text) => {
        state.nowDownloadingPercentText = text;
    },
    setTasksAfterDownload: (state, tasks) => {
        state.tasksAfterDownload = tasks;
    },
    setCallbackAfterDownload: (state, callback) => {
        state.callbackAfterDownload = callback;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
