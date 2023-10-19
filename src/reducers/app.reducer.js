import {DELETE_COMPONENT, NOTIFICATION} from '../actions/types';

const initialState = {
    deleteComponent: {},
    notification: {}
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
        default:
            return state;
    }
}

export {
    app
}