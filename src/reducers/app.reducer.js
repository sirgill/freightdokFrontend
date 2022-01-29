import {NOTIFICATION} from '../actions/types';

const initialState = {};

function app(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case NOTIFICATION:
            return {
                ...state,
                notification: payload
            }
        default:
            return state;
    }
}

export {
    app
}