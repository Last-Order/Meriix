const state = {
    show: false,
    message: ''
};

const getters = {};
const actions = {};
const mutations = {
    showError(state, payload) {
        state.show = true;
        state.message = payload;
    },
    hideError(state) {
        state.show = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}