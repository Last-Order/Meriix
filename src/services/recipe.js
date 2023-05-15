import recipes from "@/recipes/index";

class RecipeService {
    getSuitableRecipes(files) {
        const result = [];
        for (const recipe of recipes) {
            if (recipe.check(files)) {
                result.push(recipe);
            }
        }
        return result;
    }
}
export default new RecipeService();
