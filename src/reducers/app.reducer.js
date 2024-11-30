import {APP_VARIABLES, CHANGE_PASSWORD, DELETE_COMPONENT, NOTIFICATION} from '../actions/types';

const initialState = {
    deleteComponent: {},
    notification: {},
    changePasswordModal: {open: false},
    appVariables: {}
};

function app(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case NOTIFICATION:
            return {
                ...state,
                notification: payload
            }
        case DELETE_COMPONENT:
            return {
                ...state,
                deleteComponent: payload
        }
        case CHANGE_PASSWORD:
            return {
                ...state,
                changePasswordModal: payload
            }
        case APP_VARIABLES:
            return {
                ...state,
                appVariables: payload
            }
        default:
            return state;
    }
}

export {
    app
}