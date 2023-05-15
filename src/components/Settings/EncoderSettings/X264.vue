<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col :cols="4">
                    <v-select
                        density="compact"
                        :items="bitrateControlModeOptions"
                        item-title="text"
                        item-value="value"
                        label="码率控制模式"
                        v-model="bitrateControlMode"
                    ></v-select>
                </v-col>
                <v-col :cols="2">
                    <v-text-field
                        density="compact"
                        label="CRF"
                        v-model="bitrateControlValue"
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
                    text: "固定质量（CRF）",
                    value: "crf",
                },
            ],
        };
    },
    computed: {
        bitrateControlMode: {
            get() {
                return this.$store.state.settings.encoders.x264
                    .bitrateControlMode;
            },
            set(value) {
                this.$store.commit("updateEncoderSettings", {
                    name: "x264",
                    settings: {
                        bitrateControlMode: value,
                    },
                });
            },
        },
        bitrateControlValue: {
            get() {
                return this.$store.state.settings.encoders.x264
                    .bitrateControlValue;
            },
            set(value) {
                this.$store.commit("updateEncoderSettings", {
                    name: "x264",
                    settings: {
                        bitrateControlValue: value,
                    },
                });
            },
        },
    },
};
</script>
