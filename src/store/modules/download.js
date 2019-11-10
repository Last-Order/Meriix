import DownloadService from '@/services/download';
const state = {
    nowDownloadingName: '',
    nowDownloadingPercent: 0
};

const getters = {};
const actions = {
    async downloadModule({ commit, dispatch }, modules) {

    }
};
const mutations = {
    setNowDownloadingName: (state, name) => {
        state.nowDownloadingName = name;
    },
    setNowDownloadingPercent: (state, percent) => {
        state.nowDownloadingPercent = percent;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}