<template>
    <v-card>
        <v-card-title>设置</v-card-title>
        <v-card-text>
            <v-tabs v-model="activeTab">
                <v-tab :key="1" ripple>通用</v-tab>
                <v-tab :key="2" ripple>外部依赖</v-tab>
                <v-tab :key="3" ripple>编码器</v-tab>
                <v-tab :key="4" ripple>关于</v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
                <v-window-item :key="1">
                    <general />
                </v-window-item>
                <v-window-item :key="2">
                    <dependence />
                </v-window-item>
                <v-window-item :key="3">
                    <encoder />
                </v-window-item>
                <v-window-item :key="4">
                    <about />
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>
<script>
import Dependence from "./Dependence/Index.vue";
import General from "./General.vue";
import About from "./About.vue";
import Encoder from "./Encoder.vue";

export default {
    data() {
        return {
            activeTab: 0,
        };
    },
    components: {
        Encoder,
        General,
        About,
        Dependence,
    },
};
</script>
