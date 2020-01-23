const state = {
    logs: []
};

const getters = {};
const actions = {};
const mutations = {
    addLog: (state, type, content) => {
        state.logs.push({
            type,
            content,
            time: new Date()
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}