<template>
    <v-container grid-list-md>
        <h2>界面设计中</h2>
    </v-container>
</template>
<script>
    import RecipeService from '@/services/recipe';
    export default {
        data() {
            return {};
        },
        mounted() {
            this.$store.commit("setDropHelperOptions", [
                {
                    name: "video",
                    text: "释放文件以添加任务"
                },
            ]);
            this.$store.commit("setDropHandler", this.handleFileDropped);
        },
        methods: {
            handleFileDropped(event) {
                const suitableRecipes = RecipeService.getSuitableRecipes(event.files);
                if (suitableRecipes.length === 0) {
                    this.$store.commit('showError', '无可用的快速操作');
                    return;
                }
            }
        }
    }
</script>