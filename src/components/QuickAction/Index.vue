<template>
  <v-container grid-list-md>
    <v-dialog v-model="recipeDialogVisible" width="600">
      <v-card>
        <v-card-title>
          <span class="headline">可用操作</span>
        </v-card-title>
        <v-card-text>
            <recipe-list :recipes="suitableRecipes" @selected="handleRecipeSelected" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import RecipeList from "./RecipeList";
import RecipeService from "@/services/recipe";
export default {
  data() {
    return {
      recipeDialogVisible: false,
      suitableRecipes: [],
      files: []
    };
  },
  mounted() {
    this.$store.commit("setDropHelperOptions", [
      {
        name: "video",
        text: "释放文件以添加任务"
      }
    ]);
    this.$store.commit("setDropHandler", this.handleFileDropped);
  },
  methods: {
    handleFileDropped(event) {
      this.files = event.files;
      const suitableRecipes = RecipeService.getSuitableRecipes(event.files);
      if (suitableRecipes.length === 0) {
        this.$store.commit("showError", "无可用的快速操作");
        return;
      }
      this.suitableRecipes = suitableRecipes;
      this.recipeDialogVisible = true;
    },
    handleRecipeSelected(recipe) {
      const tasks = recipe.generateTasks(this.files);
      this.$store.dispatch('addTasks', tasks);
      this.recipeDialogVisible = false;
    }
  },
  components: {
    RecipeList
  }
};
</script>