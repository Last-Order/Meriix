<template>
    <v-container grid-list-md>
        <v-dialog v-model="recipeDialogVisible" width="600">
            <v-card v-if="step === 'select'">
                <v-card-title>
                    <span class="headline">可用操作</span>
                </v-card-title>
                <v-card-text>
                    <recipe-list :recipes="suitableRecipes" @selected="handleRecipeSelected" />
                </v-card-text>
            </v-card>
            <v-card v-if="step === 'option'" style="float: left; width: 100%">
                <v-card-title>
                    <span class="headline">参数设置</span>
                </v-card-title>
                <v-card-text>
                    <option-form
                        :scheme="formScheme"
                        @change="handleOptionFormUpdated"
                    ></option-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text color="primary" @click="handleOptionFormFinished">加入队列</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import RecipeList from "./RecipeList";
import OptionForm from "./OptionForm";
import RecipeService from "@/services/recipe";
export default {
    data() {
        return {
            recipeDialogVisible: false,
            step: "select",
            suitableRecipes: [],
            selectedRecipe: undefined,
            files: [],
            form: {},
            formScheme: [],
        };
    },
    mounted() {
        this.$store.commit("setDropHelperOptions", [
            {
                name: "video",
                text: "释放文件以添加任务",
            },
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
            this.step = "select";
            this.recipeDialogVisible = true;
        },
        handleRecipeSelected(recipe) {
            this.selectedRecipe = recipe;
            if (!recipe.definition.userOptions) {
                this.generateTasks(recipe);
            } else {
                this.formScheme = recipe.definition.userOptions;
                this.step = "option";
            }
        },
        handleOptionFormFinished() {
            const defaults = {};
            this.selectedRecipe.definition.userOptions.forEach((item) => {
                defaults[item.name] = item.defaultValue;
            });
            this.generateTasks(this.selectedRecipe, {
                ...defaults,
                ...this.form,
            });
        },
        handleOptionFormUpdated(form) {
            this.form = form;
        },
        async generateTasks(recipe, options) {
            const taskSettings = {};
            let taskGernerationResult = recipe.generateTasks(this.files, options);
            if (typeof taskGernerationResult.then === "function") {
                // check if task generation result is a promise
                taskGernerationResult = await taskGernerationResult;
            }
            if (taskGernerationResult?.[0]?.encoderWhitelist) {
                // if task only support specified encoders
                taskSettings.encoderName = this.$store.state.global.availableEncoders.filter(
                    (encoder) => taskGernerationResult[0].encoderWhitelist.includes(encoder)
                )[0];
            } else {
                // task support all encoders, use the top priority encoder
                taskSettings.encoderName = this.$store.state.global.availableEncoders[0];
            }
            taskSettings.encoderSettings = this.$store.getters.getEncoderCommandArgumentsByName(
                taskSettings.encoderName
            );
            this.$store.dispatch("addTasks", {
                tasks: taskGernerationResult,
                settings: taskSettings,
            });
            this.recipeDialogVisible = false;
        },
    },
    components: {
        RecipeList,
        OptionForm,
    },
};
</script>
