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

export {
    addEvent,
    removeEvent,
    triggerCustomEvent
}