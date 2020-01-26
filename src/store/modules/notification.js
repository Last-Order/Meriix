const state = {
    logs: []
};

const getters = {};
const actions = {};
const mutations = {
    addSystemLog: (state, { type, content }) => {
        state.logs.push({
            type,
            content,
            time: new Date().valueOf()
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}