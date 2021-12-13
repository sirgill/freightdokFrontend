
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const changeObjectKey = (obj, old_key, new_key) => {
    if (old_key !== new_key) {
        Object.defineProperty(obj, new_key,
            Object.getOwnPropertyDescriptor(obj, old_key));
        delete obj[old_key];
    }
    return obj;
}