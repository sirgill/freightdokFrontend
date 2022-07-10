import axios from 'axios';
import { setAlert } from './alert.js';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE,
    USER_UPDATED,
    AUTH_UPDATE_FAIL,
    AUTH_UPDATE,
} from './types';

import setAuthToken from '../utils/setAuthToken';
import { requestPost } from "../utils/request";
import { notification } from "./alert";

//Load user
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }

};

// Register user
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }

};

// Login user
export const login = ({ email, password }, history) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const { success, data } = await requestPost({ uri: '/api/auth', body, showTriggers: false });
        if (success) {
            setAuthToken(data.token)

            dispatch({
                type: LOGIN_SUCCESS,
                payload: data
            });

            dispatch(loadUser());

            if (data.token) {
                history.push('/dashboard');
            }
        }
        else {
            const { errors = [] } = data || {},
                [{ msg = '' }] = errors || [{}];
            notification(msg, 'error')
        }
    } catch (err) {
        console.log("ERROR:", err);
        const errors = err;

        if (errors && Array.isArray(errors)) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }

};

// Update user
export const updateUser = (data) => async dispatch => {
    dispatch({ type: AUTH_UPDATE });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify(data);
    try {
        const res = await axios.patch('/api/auth', body, config);
        dispatch({
            type: USER_UPDATED,
            payload: data
        });
    } catch (err) {
        dispatch({
            type: AUTH_UPDATE_FAIL,
            payload: err.message
        });
    }
}

//Logout / Clear Profile
export const logout = () => dispatch => {
    delete axios.defaults.headers.common['x-auth-token'];
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
};