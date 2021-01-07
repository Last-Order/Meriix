import TaskExecuter from "@/services/task";
import DependenceService from "@/services/dependence";
const uuid = require("uuid/v4");
const kill = require("tree-kill");
const state = {
    tasks: [],
    runningTasks: 0,
};

const getters = {};
const actions = {
    addTasks({ commit, dispatch }, { tasks, settings }) {
        const taskDependencies = tasks[0].dependencies;
        const missingDeps = [];
        for (const dep of taskDependencies) {
            if (!DependenceService.isModuleInstalled(dep)) {
                missingDeps.push(dep);
            }
        }
        const tasksToAdd = tasks.map((t) => {
            return {
                ...t,
                ...settings,
            };
        });
        if (missingDeps.length > 0) {
            commit("setNowDownloadingNames", missingDeps);
            commit("setDownloadVisible", true);
            commit("setNowDownloadingPercent", 0);
            commit("setTasksAfterDownload", tasksToAdd);
        } else {
            commit("addTasks", tasksToAdd);
            commit("setQueueDrawerVisible", true);
            dispatch("checkQueue");
        }
    },
    checkQueue({ state, dispatch }) {
        if (state.runningTasks > 0) {
            return;
        }
        const task = state.tasks.find((t) => t.category === "unfinished" && t.status !== "fail");
        if (task) {
            dispatch("runTask", task.uuid);
        } else {
            new Notification("Meriix", {
                body: "队列内任务已全部完成",
            });
        }
    },
    runTask({ commit, state, dispatch }, uuid) {
        const task = state.tasks.find((t) => t.uuid === uuid);
        const executer = new TaskExecuter(task);
        executer.on("step", (currentStepIndex) => {
            commit("updateTask", {
                uuid,
                payload: {
                    currentStepIndex,
                },
            });
        });
        executer.on("output", (log) => {
            commit("addTaskLog", {
                uuid,
                log,
            });
        });
        executer.on("start", (child) => {
            commit("updateTask", {
                uuid,
                payload: {
                    startTime: new Date(),
                    child,
                },
            });
        });
        executer.on("progress", (e) => {
            commit("updateTask", {
                uuid,
                payload: {
                    phase: e.phase,
                    progress: e.progress,
                },
            });
        });
        executer.on("fail", () => {
            commit("updateTask", {
                uuid,
                payload: {
                    status: "fail",
                    phase: "发生错误",
                },
            });
            commit("decRunningTasksCount");
            dispatch("checkQueue");
        });
        executer.on("finish", (task) => {
            commit("updateTask", {
                uuid,
                payload: {
                    status: "finish",
                    category: "finished",
                    phase: "已完成",
                    output: task.output,
                },
            });
            commit("decRunningTasksCount");
            dispatch("checkQueue");
        });
        executer.run();
        commit("incRunningTasksCount");
    },
    killTask({ commit, state }, uuid) {
        const task = state.tasks.find((t) => t.uuid === uuid);
        if (task.child && task.child.pid) {
            try {
                kill(task.child.pid);
            } catch {
                // 无事发生
            }
        }
        commit("updateTask", {
            uuid,
            payload: {
                phase: "已取消",
                category: "canceled",
            },
        });
        commit("decRunningTasksCount");
    },
};
const mutations = {
    addTasks(state, tasks) {
        state.tasks.push(
            ...tasks.map((t) => {
                return {
                    ...t,
                    uuid: uuid(),
                    addTime: new Date(),
                    startTime: undefined,
                    phase: undefined,
                    progress: undefined,
                    logs: [],
                    status: "pending",
                    category: "unfinished",
                    child: undefined,
                    currentStepIndex: -1,
                };
            })
        );
    },
    updateTask(state, { uuid, payload }) {
        const index = state.tasks.findIndex((t) => t.uuid === uuid);
        state.tasks = [
            ...state.tasks.slice(0, index),
            {
                ...state.tasks[index],
                ...payload,
            },
            ...state.tasks.slice(index + 1),
        ];
    },
    addTaskLog(state, { uuid, log }) {
        state.tasks.find((t) => t.uuid === uuid).logs.push(log);
    },
    incRunningTasksCount(state) {
        state.runningTasks = state.runningTasks + 1;
    },
    decRunningTasksCount(state) {
        state.runningTasks = state.runningTasks - 1;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
