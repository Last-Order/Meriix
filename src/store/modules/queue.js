const state = {
    tasks: []
};

const getters = {};
const actions = {};
const mutations = {
    addTasks(state, tasks) {
        state.tasks.push(...tasks.map(t => {
            return {
                ...t,
                startTime: new Date(),
                phase: undefined,
                progress: undefined
            }
        }));
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}