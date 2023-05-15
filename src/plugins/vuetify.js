import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";

const vuetify = createVuetify({
    directives,
    aliases,
    sets: {
        mdi,
    },
    components: {
        ...components,
        ...labsComponents,
    },
});

export default vuetify;
