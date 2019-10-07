import * as recipes from '@/recipes/index';
class RecipeService {
    getSuitableRecipes(files) {
        const result = [];
        for (const key of Object.keys(recipes)) {
            if (recipes[key].check(files)) {
                result.push(recipes[key]);
            }
        }
        return result;
    }
}
export default new RecipeService();