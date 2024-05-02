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
import {requestGet, requestPost} from "../utils/request";
import {AUTH_USER} from "../config/requestEndpoints";
import {UserSettings} from "../components/Atoms/client";

//Load user
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const {data} = await requestGet({uri: AUTH_USER, showTriggers: true})
        dispatch({
            type: USER_LOADED,
            payload: data
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
export const login = ({data}) => async dispatch => {

    try {
        setAuthToken(data.token)
        UserSettings.setUserPermissions(data.userPermissions)
        localStorage.setItem('supportsNewPermission', data?.supportsNewPermission || false)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        });

        dispatch(loadUser());
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

export const signupSupport = async (body) => {
    try {
        body.phoneNumber = '+1' + body.phoneNumber;
        const { success, data } = await requestPost({ uri: '/api/onBoarding', body });
        return { data, success };
    } catch (e) {
        console.log(e.message);
    }
}