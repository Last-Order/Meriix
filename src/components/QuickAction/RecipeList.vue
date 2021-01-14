<template>
    <v-list two-line>
        <template v-if="loading">
            <div class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
        </template>
        <template v-else>
            <template v-for="recipe in recipes">
                <v-list-item
                    :key="recipe.definition.id"
                    ripple
                    @click="handleRecipeSelected(recipe)"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            <div class="item-title-container">
                                <div class="item-title">{{ recipe.definition.name }}</div>
                                <div class="item-version">{{ recipe.definition.version }}</div>
                            </div>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                            recipe.definition.description
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </template>
    </v-list>
</template>
<style lang="scss" scoped>
    .item-title-container {
        display: flex;
    }
    .item-version {
        margin-left: 6px;
        background-color: rgb(156 156 156 / 70%);
        color: #fff;
        padding: 2px 4px;
        border-radius: 2px;
        font-size: smaller;
    }
</style>
<script>
export default {
    props: ["recipes"],
    data() {
        return {
            loading: false,
        };
    },
    watch: {
        recipes() {
            this.loading = false;
        },
    },
    methods: {
        handleRecipeSelected(recipe) {
            this.loading = true;
            this.$emit("selected", recipe);
        },
    },
};
</script>
