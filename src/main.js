import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store/index";

// Vue.config.productionTip = false;
// Vue.config.devtools = process.env.NODE_ENV === "development";
// new Vue({
//     vuetify,
//     store,
//     render: (h) => h(App),
// }).$mount("#app");

createApp(App).use(store).use(vuetify).mount("#app");
