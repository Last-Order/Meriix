const context = require.context(".", true, /^\.\/(?!(index|base_recipe)).+.js$/);
const recipes = {};
context.keys().forEach(function (key) {
    const module = context(key);
    const moduleName = module.default.name;
    recipes[moduleName] = module.default;
});

module.exports = recipes;
