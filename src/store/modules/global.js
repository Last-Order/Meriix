const state = {
    dropHelperOptions: [],
    availableEncoders: [],
    dropHandler: () => { },
    queueDrawerVisible: false,
    downloadVisible: false
};

const getters = {};
const actions = {};
const mutations = {
    setDropHelperOptions(state, payload) {
        state.dropHelperOptions = payload;
    },
    setDropHandler(state, payload) {
        state.dropHandler = payload;
    },
    setQueueDrawerVisible(state, payload) {
        state.queueDrawerVisible = payload;
    },
    setDownloadVisible(state, payload) {
        state.downloadVisible = payload;
    },
    setAvailableEncoders(state, encoders) {
        state.availableEncoders = encoders;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}