<template>
    <div
        v-if="
            scheme && scheme.length > 0 && Object.keys(nameMapping).length > 0
        "
    >
        <v-form>
            <template v-for="item in scheme" :key="item.name">
                <v-row>
                    <template v-if="item.type === 'select'">
                        <v-col cols="6">
                            <v-select
                                v-model="form[item.name]"
                                :items="getSchemeItemByName(item.name).values"
                                :label="getSchemeItemByName(item.name).label"
                            ></v-select>
                        </v-col>
                    </template>
                    <template v-if="item.type === 'input'">
                        <v-col cols="6">
                            <v-text-field
                                :value="
                                    getSchemeItemByName(item.name).defaultValue
                                "
                                :label="getSchemeItemByName(item.name).label"
                                @change="(v) => updateForm(item.name, v)"
                            ></v-text-field>
                        </v-col>
                    </template>
                    <template v-if="item.type === 'checkbox'">
                        <v-col cols="6">
                            <v-checkbox
                                v-model="form[item.name]"
                                :label="getSchemeItemByName(item.name).label"
                            ></v-checkbox>
                        </v-col>
                    </template>
                </v-row>
            </template>
        </v-form>
    </div>
</template>
<script>
export default {
    props: ["scheme", "initial"],
    watch: {
        scheme() {
            this.updateScheme();
        },
    },
    data() {
        return {
            form: {},
            nameMapping: {},
        };
    },
    mounted() {
        this.updateScheme();
    },
    methods: {
        updateScheme() {
            const form = {};
            const nameMapping = {};
            for (const item of this.scheme) {
                if (item.type === "select" || item.type === "input") {
                    form[item.name] =
                        this.initial?.[item.name] !== undefined
                            ? this.initial?.[item.name]
                            : item.defaultValue;
                }
                if (item.type === "checkbox") {
                    form[item.name] =
                        this.initial?.[item.name] !== undefined
                            ? this.initial?.[item.name]
                            : item.defaultValue;
                }
                nameMapping[item.name] = {
                    ...item,
                    ...(this.initial?.[item.name] !== undefined
                        ? {
                              defaultValue: this.initial[item.name],
                          }
                        : {}),
                };
            }
            this.form = form;
            this.nameMapping = nameMapping;
        },
        updateForm(name, value) {
            this.form[name] = value;
            this.$emit("change", this.form);
        },
        getSchemeItemByName(name) {
            if (this.nameMapping[name]) {
                return this.nameMapping[name];
            }
            return {};
        },
    },
};
</script>
