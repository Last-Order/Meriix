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
            <v-card v-if="step === 'option'" :loading="loading" style="float: left; width: 100%">
                <template slot="progress">
                    <v-progress-linear color="primary" height="5" indeterminate></v-progress-linear>
                </template>
                <v-card-title>
                    <span class="headline">参数设置</span>
                </v-card-title>
                <v-card-text>
                    <option-form :scheme="formScheme" :initial="initialForm"
                        @change="handleOptionFormUpdated"></option-form>
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
import RecipeList from "./RecipeList.vue";
import OptionForm from "./OptionForm.vue";
import RecipeService from "@/services/recipe";
import StorageService from "@/services/storage";

export default {
    data() {
        return {
            recipeDialogVisible: false,
            step: "select",
            suitableRecipes: [],
            selectedRecipe: undefined,
            files: [],
            form: {},
            initialForm: {},
            formScheme: [],
            loading: false,
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
                this.loading = false;
                // Get last time user input options
                const options = StorageService.getRecipeOptions(this.selectedRecipe.definition.id);
                const defaultOptions = Object.fromEntries(this.formScheme.map(o => [o.name, o.defaultValue]));
                this.initialForm = {
                    ...this.form,
                    ...defaultOptions,
                    ...options,
                };
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
            // Save option values
            StorageService.setRecipeOptions(this.selectedRecipe.definition.id, this.form);
        },
        handleOptionFormUpdated(form) {
            this.form = form;
        },
        async generateTasks(recipe, options) {
            const taskSettings = {};
            // show loading if generation costs over 300ms
            const loadingTimer = setTimeout(() => {
                this.loading = true;
            }, 300);
            let taskGernerationResult = recipe.generateTasks(this.files, options);
            if (typeof taskGernerationResult.then === "function") {
                // check if task generation result is a promise
                taskGernerationResult = await taskGernerationResult;
            }
            clearTimeout(loadingTimer);
            this.loading = false;
            if (
                taskGernerationResult?.[0]?.encoderWhitelist &&
                taskGernerationResult[0].encoderWhitelist.length > 0
            ) {
                // if task only support specified encoders
                const availableEncoders = this.$store.state.global.availableEncoders.filter(
                    (encoder) => taskGernerationResult[0].encoderWhitelist.includes(encoder)
                );
                if (availableEncoders.length > 0) {
                    taskSettings.encoderName = availableEncoders[0];
                } else {
                    this.$store.commit("showError", "没有可用于该任务的编码器");
                    return;
                }
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
