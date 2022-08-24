import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {errorIconColor, successIconColor} from "../components/layout/ui/Theme";
import {Cancel as CancelIcon} from "@mui/icons-material";
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

function parseToken (token = '') {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload) || {};
}

const getUserDetail = () => {
    return {...parseToken(localStorage.getItem('token'))}
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

export const getCheckStatusIcon = (comparator = false) => {
    let success = false
    if(typeof comparator === 'function'){
        success = comparator();
    } else {
        success = comparator
    }
    return success ? (
        <CheckCircleIcon style={{color: successIconColor}}/>
    ) : (
        <CancelIcon style={{color: errorIconColor}}/>
    )
}

export {
    addEvent,
    removeEvent,
    getUserDetail,
    isEmailValid,
    checkObjProperties,
    triggerCustomEvent
}