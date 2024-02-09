import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { errorIconColor, successIconColor } from "../components/layout/ui/Theme";
import { Cancel as CancelIcon } from "@mui/icons-material";
import React from "react";

const addEvent = (elem, type, eventHandle) => {
    if (elem == null || typeof elem === 'undefined') {
        return;
    }

    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = eventHandle;
    }
};

const removeEvent = (elem, type, eventHandle) => {
    if (elem == null || typeof elem === 'undefined') {
        return;
    }

    if (elem.removeEventListener) {
        elem.removeEventListener(type, eventHandle, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = null;
    }
};

const triggerCustomEventOnElement = (element, eventName, eventDetail) => {
    let event = new CustomEvent(eventName, {
        detail: eventDetail
    });
    element.dispatchEvent(event);
};

const triggerCustomEvent = (eventName, eventDetail = {}) => {
    triggerCustomEventOnElement(window, eventName, eventDetail);
};

// eslint-disable-next-line no-extend-native
String.prototype.equalsIgnoreCase = function (str) {
    return str !== null && typeof str === 'string' && this.toUpperCase() === str.toUpperCase()
}

// eslint-disable-next-line no-extend-native
String.prototype.removeWhiteSpaces = function (replaceBy) {
    return this && this.replace(/\s/g, replaceBy || '')
}
// eslint-disable-next-line no-extend-native
Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.splice(1)
    },
    enumerable: false
})

function parseToken(token = '') {
    if(token && String(token) !== 'undefined'){
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload) || {};
    } else {
        return {}
    }
}

const getUserDetail = () => {
    return { ...parseToken(localStorage.getItem('token')) }
}

const checkObjProperties = (obj) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== "")
            return true;
    }
    return false;
}

const isEmailValid = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isPhoneValid = (num) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return re.test(String(num).toLowerCase());
}

export const getCheckStatusIcon = (comparator = false) => {
    let success
    if (typeof comparator === 'function') {
        success = comparator();
    } else {
        success = comparator
    }
    return success ? (
        <CheckCircleIcon style={{ color: successIconColor }} />
    ) : (
        <CancelIcon style={{ color: errorIconColor }} />
    )
}

export const textFormatter = (str) => {
    return str || '--'
}

export const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
}

export const getRoutesByPermission = (routes) => {
    const {user: {role = ''} = {}} = getUserDetail();
    const arr = [];
    routes.forEach(route => {
        const {permissions = []} = route;
        if(permissions.indexOf(role) > -1){
            arr.push(route)
        }
    })
    return arr;
}

export const serialize = (obj = {}) => {
    const str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            const q = encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])
            str.push(q.replaceAll('%20', '+'));
        }
    return str.join("&");
}

export {
    addEvent,
    removeEvent,
    isPhoneValid,
    getUserDetail,
    isEmailValid,
    checkObjProperties,
    triggerCustomEvent
}