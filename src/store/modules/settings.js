import Storage from "@/services/storage";
const state = {
    dependence: {
        remoteLibraryRepositoryUrl: Storage.getSetting("dependence.remoteLibraryRepositoryUrl", ""),
    },
    encoders: {
        x264: {
            bitrateControlMode: Storage.getSetting("encoders.x264.bitrateControlMode", "crf"),
            bitrateControlValue: Storage.getSetting("encoders.x264.bitrateControlValue", 21),
            preset: Storage.getSetting("encoders.x264.preset", "medium"),
        },
        nvencc: {
            bitrateControlMode: Storage.getSetting("encoders.nvencc.bitrateControlMode", "vbrhq"),
            bitrateControlValue: Storage.getSetting("encoders.nvencc.bitrateControlValue", 5980),
        },
        qsvencc: {
            bitrateControlMode: Storage.getSetting("encoders.qsvencc.bitrateControlMode", "la"),
            bitrateControlValue: Storage.getSetting("encoders.qsvencc.bitrateControlValue", 5980),
        },
    },
};

const getters = {
    getEncoderCommandArgumentsByName: (state) => (encoderName) => {
        const encoderSettings = state.encoders[encoderName];
        switch (encoderName) {
            case "x264": {
                return {
                    [encoderSettings.bitrateControlMode]: encoderSettings.bitrateControlValue,
                };
            }
            case "nvencc": {
                return {
                    [encoderSettings.bitrateControlMode]: encoderSettings.bitrateControlValue,
                };
            }
            case "qsvencc": {
                return {
                    [encoderSettings.bitrateControlMode]: encoderSettings.bitrateControlValue,
                };
            }
        }
    },
};
const actions = {};
const mutations = {
    updateRemoteLibraryRepositoryUrl(state, remoteRepositoryUrl) {
        state.dependence.remoteLibraryRepositoryUrl = remoteRepositoryUrl;
        Storage.setSetting("dependence.remoteLibraryRepositoryUrl", remoteRepositoryUrl);
    },
    updateEncoderSettings(state, { name, settings }) {
        state.encoders[name] = {
            ...state.encoders[name],
            ...settings,
        };
        Storage.setSetting(`encoders.${name}`, {
            ...state.encoders[name],
            ...settings,
        });
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
