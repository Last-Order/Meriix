import { get, set } from 'lodash';
export default class Storage {
    static getSetting(name, defaultValue) {
        const settings = localStorage.getItem('settings') ?
            JSON.parse(localStorage.getItem('settings')) : {};
        return get(settings, name) === undefined ? defaultValue : get(settings, name);
    }
    static setSetting(name, value) {
        const settings = localStorage.getItem('settings') ?
            JSON.parse(localStorage.getItem('settings')) : {};
        set(settings, name, value);
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    static deleteSetting(name) {
        Storage.setSetting(name, undefined);
    }
}