<template>
  <div class="encoder-list-container">
    <v-card flat v-for="(encoder, index) in availableEncoders" :key="encoder.name">
      <v-card-title>
        <div>{{ encoder.name }}</div>
        <v-spacer />
        <v-chip class="ma-2" small v-if="index === 0" color="primary">最优先</v-chip>
      </v-card-title>
      <v-card-text>
        <template v-if="encoder.isAvailable">
          <component :is="encoder.name" />
        </template>
        <template v-else>
            <i class="gray">当前不可用</i>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text v-if="index !== 0" @click="increasePriority(encoder)">上移</v-btn>
        <v-btn
          text
          v-if="index !== availableEncoders.length - 1"
          @click="decreasePriority(encoder)"
        >下移</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import X264 from "./EncoderSettings/X264";
import Nvencc from "./EncoderSettings/Nvencc";
import Qsvencc from "./EncoderSettings/Qsvencc";
import DefaultEncoderPriority from "@/definitions/default_encoder_priority";
export default {
  data() {
    return {};
  },
  computed: {
    availableEncoders() {
      const encoders = DefaultEncoderPriority;
      const priority = this.$store.state.global.encoderPriority || encoders;
      return priority.map(encoder => {
        return {
          name: encoder,
          isAvailable: this.$store.state.global.availableEncoders.includes(
            encoder
          )
        };
      });
    }
  },
  methods: {
    increasePriority(encoder) {
      const previousIndex = this.availableEncoders.findIndex(
        ec => ec.name === encoder.name
      );
      const encoderNames = this.availableEncoders.map(ec => ec.name);
      this.$store.commit("setEncoderPriority", [
        ...encoderNames.slice(0, previousIndex - 1),
        encoderNames[previousIndex],
        encoderNames[previousIndex - 1],
        ...encoderNames.slice(previousIndex + 1)
      ]);
    },
    decreasePriority(encoder) {
      const previousIndex = this.availableEncoders.findIndex(
        ec => ec.name === encoder.name
      );
      const encoderNames = this.availableEncoders.map(ec => ec.name);
      this.$store.commit("setEncoderPriority", [
        ...encoderNames.slice(0, previousIndex),
        encoderNames[previousIndex + 1],
        encoderNames[previousIndex],
        ...encoderNames.slice(previousIndex + 2)
      ]);
    }
  },
  components: {
    x264: X264,
    nvencc: Nvencc,
    qsvencc: Qsvencc
  }
};
</script>