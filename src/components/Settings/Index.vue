<template>
  <v-card>
    <v-card-title>设置</v-card-title>
    <v-card-text>
      <v-tabs v-model="activeTab">
        <v-tab :key="1" ripple>通用</v-tab>
        <v-tab :key="2" ripple>关于</v-tab>
        <v-tabs-items v-model="activeTab">
          <v-tab-item :key="1">
            <general />
          </v-tab-item>
          <v-tab-item :key="2">
            <about />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>
<script>
import General from './General';
import About from './About';
export default {
  data() {
    return {
      activeTab: 0
    };
  },
  components: {
      General,
      About
  }
};
</script>