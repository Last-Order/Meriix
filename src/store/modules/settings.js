import Storage from '@/services/storage';
const state = {
    dependence: {
        remoteLibraryRepositoryUrl: Storage.getSetting('dependence.remoteLibraryRepositoryUrl', '')
    }
};

const getters = {};
const actions = {};
const mutations = {
    updateRemoteLibraryRepositoryUrl(state, remoteRepositoryUrl) {
        state.dependence.remoteLibraryRepositoryUrl = remoteRepositoryUrl;
        Storage.setSetting('dependence.remoteLibraryRepositoryUrl', remoteRepositoryUrl);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}