const state = {
    dropHelperOptions: [],
    dropHandler: () => { },
    queueDrawerVisible: false,
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}