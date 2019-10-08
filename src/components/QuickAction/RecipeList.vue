<template>
  <v-list two-line>
    <template v-for="recipe in recipes">
      <v-list-item :key="recipe.definition.id" ripple @click="handleRecipeSelected(recipe)">
        <v-list-item-content>
          <v-list-item-title>{{ recipe.definition.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ recipe.definition.description }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
export default {
  props: ["recipes"],
  data() {
    return {};
  },
  methods: {
      handleRecipeSelected(recipe) {
          this.$emit('selected', recipe);
      }
  }
};
</script>