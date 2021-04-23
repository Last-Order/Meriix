import { get, set } from "lodash";
export default class Storage {
    static get(key) {
        const result = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
        return result;
    }
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    static getSetting(name, defaultValue) {
        const settings = Storage.get("settings");
        return get(settings, name) === undefined ? defaultValue : get(settings, name);
    }
    static setSetting(name, value) {
        const settings = Storage.get("settings");
        set(settings, name, value);
        Storage.set("settings", settings);
    }
    static deleteSetting(name) {
        Storage.setSetting(name, undefined);
    }
    static getRecipeOptions(name) {
        const options = Storage.get("recipeOptions");
        return get(options, name) === undefined ? {} : get(options, name);
    }
    static setRecipeOptions(name, value) {
        const options = Storage.get("recipeOptions");
        set(options, name, value);
        Storage.set("recipeOptions", options);
    }
}
