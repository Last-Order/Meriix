<template>
    <div class="encoder-list-container">
        <v-card flat v-for="encoder in availableEncoders" :key="encoder">
            <v-card-title>{{ encoder }}</v-card-title>
            <v-card-text>
                <component :is="encoder" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text>下移</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
import X264 from './EncoderSettings/X264';
import Nvencc from './EncoderSettings/Nvencc';
import Qsvencc from './EncoderSettings/Qsvencc';
export default {
    data() {
        return {};
    },
    computed: {
        availableEncoders() {
            return this.$store.state.global.availableEncoders;
        }
    },
    components: {
        x264: X264,
        nvencc: Nvencc,
        qsvencc: Qsvencc
    }
}
</script>