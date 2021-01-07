<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col :cols="4">
                    <v-select
                        dense
                        :items="bitrateControlModeOptions"
                        label="码率控制模式"
                        v-model="bitrateControlMode"
                    ></v-select>
                </v-col>
                <v-col :cols="2">
                    <v-text-field
                        dense
                        label="码率"
                        v-model="bitrateControlValue"
                        suffix="Kbps"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script>
export default {
    data() {
        return {
            bitrateControlModeOptions: [
                {
                    text: "LookAhead",
                    value: "la",
                },
                {
                    text: "可变码率（VBR）",
                    value: "vbr",
                },
                {
                    text: "自适应可变码率（AVBR）",
                    value: "avbr",
                },
            ],
        };
    },
    computed: {
        bitrateControlMode: {
            get() {
                return this.$store.state.settings.encoders.qsvencc.bitrateControlMode;
            },
            set(value) {
                this.$store.commit("updateEncoderSettings", {
                    name: "qsvencc",
                    settings: {
                        bitrateControlMode: value,
                    },
                });
            },
        },
        bitrateControlValue: {
            get() {
                return this.$store.state.settings.encoders.qsvencc.bitrateControlValue;
            },
            set(value) {
                this.$store.commit("updateEncoderSettings", {
                    name: "qsvencc",
                    settings: {
                        bitrateControlValue: value,
                    },
                });
            },
        },
    },
};
</script>
