import {CHROBINSON} from "../../views/openBoard/constants";

const getUserSettings = (dashboard) => {
    const storage = JSON.parse(localStorage.getItem('usr') || '{}')
    if (dashboard) {
        return storage[dashboard] || {};
    }
    return storage;
}
const setUserSettings = (value) => {
    localStorage.setItem('usr', JSON.stringify(value));
}

export const clearUserSettings = () => {
    localStorage.removeItem('usr');
}

export const UserSettings = {
    getSettings(id) {
        return id ? localStorage.getItem(id) : {};
    },
    setSetting(key, prop) {
        localStorage.setItem(key, prop)
    },
    getActiveOpenBoard() {
        return function () {
            const obj = getUserSettings('openBoard');
            const {activeBoard} = obj;
            return activeBoard || CHROBINSON;
        }
    },
    setActiveOpenBoard(key, value) {
        const obj = getUserSettings('openBoard');
        const o = obj.openBoard || {}
        o[key] = value;
        setUserSettings({...obj, openBoard: o});
    }
}