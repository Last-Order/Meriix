import DownloadService from '@/services/download';
const state = {
    nowDownloadingNames: ['eac3to'],
    nowDownloadingPercent: 0,
    nowDownloadingPercentText: ''
};

const getters = {};
const actions = {
    async downloadModule({ commit, dispatch }, modules) {

    }
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}