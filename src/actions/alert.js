import {v4 as uuidv4} from 'uuid';
import store from "../store"
import {SET_ALERT, REMOVE_ALERT, NOTIFICATION} from './types';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), timeout);
};

export const notification = (message, type, rest) => {
    const id = uuidv4();
    store.dispatch({type: NOTIFICATION, payload: {open: true, message, type, id, ...rest}});
}
