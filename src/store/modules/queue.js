import TaskExecuter from '@/services/task';
const uuid = require('uuid/v4');
const state = {
    tasks: []
};

const getters = {};
const actions = {
    runTask({ commit, state }, uuid) {
        const task = state.tasks.find(t => t.uuid === uuid);
        const executer = new TaskExecuter(task);
        executer.on('output', log => {
            commit('addLog', {
                uuid,
                log
            });
        });
        executer.on('progress', e => {
            commit('updateTask', {
                uuid,
                payload: {
                    phase: e.phase,
                    progress: e.progress
                }
            });
        })
        executer.on('success', () => {
            commit('updateTask', {
                uuid,
                payload: {
                    status: 'success',
                    phase: '已完成'
                }
            });
        });
        executer.on('fail', () => {
            commit('updateTask', {
                uuid,
                payload: {
                    status: 'fail',
                    phase: '发生错误'
                }
            });
        });
        executer.run();
    }
};
const mutations = {
    addTasks(state, tasks) {
        state.tasks.push(...tasks.map(t => {
            return {
                ...t,
                uuid: uuid(),
                addTime: new Date(),
                startTime: undefined,
                phase: undefined,
                progress: undefined,
                logs: [],
                status: 'pending'
            }
        }));
    },
    updateTask(state, { uuid, payload }) {
        const index = state.tasks.findIndex(t => t.uuid === uuid);
        state.tasks = [
            ...state.tasks.slice(0, index),
            {
                ...state.tasks[index],
                ...payload
            },
            ...state.tasks.slice(index +  1)
        ];
    },
    addLog(state, { uuid, log }) {
        state.tasks.find(t => t.uuid === uuid).logs.push(log);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}