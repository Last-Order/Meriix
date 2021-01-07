import Storage from "@/services/storage";
import DEFAULT_ENCODER_PRIORITY from "@/definitions/default_encoder_priority";
const state = {
    dropHelperOptions: [],
    dropHandler: () => {},
    queueDrawerVisible: false,
    downloadVisible: false,
    availableEncoders: [],
    encoderPriority: Storage.getSetting("global.encoderPriority", DEFAULT_ENCODER_PRIORITY),
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
    },
    setEncoderPriority(state, priority) {
        state.encoderPriority = priority;
        Storage.setSetting("global.encoderPriority", priority);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
