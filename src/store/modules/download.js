const state = {
    nowDownloadingNames: [],
    nowDownloadingPercent: 0,
    nowDownloadingPercentText: '',
    tasksAfterDownload: []
};

const getters = {};
const actions = {

};
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}