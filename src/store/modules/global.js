const state = {
    dropHelperOptions: [],
    dropHandler: () => { },
};

const getters = {};
const actions = {};
const mutations = {
    setDropHelperOptions(state, payload) {
        state.dropHelperOptions = payload;
    },
    setDropHandler(state, payload) {
        state.dropHandler = payload;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}