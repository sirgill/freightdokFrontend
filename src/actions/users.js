import axios from 'axios';
import {
    FETCH_USERS_SUCCEED,
    FETCH_USERS_FAILED,
    FETCH_USERS,
    ADMIN_REG_USER,
    ADMIN_REG_USER_SUCCEED,
    ADMIN_REG_USER_FAILED,
    SELECT_USER_TO_EDIT,
    RESET_SELECTED_USER,
    INIT_ADMIN_UPDATE_USER,
    ADMIN_UPDATE_USER_SUCCEED,
    ADMIN_UPDATE_USER_FAILED,
    INIT_ADMIN_DELETE_USER,
    ADMIN_DELETE_USER_SUCCEED,
    ADMIN_DELETE_USER_FAILED,
    OPEN_USER_MODAL,
    CLOSE_USER_MODAL
} from './types';
import {notification} from "./alert";

export const callApi = () => ({
    type: FETCH_USERS
});

export const fetchUsers = (page = 0, limit = 5) => async dispatch => {
    try {
        dispatch({type: FETCH_USERS});
        const res = await axios.get(`/api/users?page=${page + 1}&limit=${limit}`);
        dispatch({
            type: FETCH_USERS_SUCCEED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_USERS_FAILED
        });
    }
};

export const registerUser = ({email, password, role}) => async (dispatch, getState) => {
    try {
        dispatch({type: ADMIN_REG_USER});
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({email, password, role});
        const api = await axios.post('/api/users', body, config);
        if (api.status === 200) {
            notification("User Added")
            const {limit} = getState().users;
            dispatch(fetchUsers(0, +limit));
        }
    } catch (err) {
        let errorToSend = err.message;
        if (err.response && err.response.data) {
            errorToSend = err.response.data.errors[0].msg
        }
        dispatch({
            type: ADMIN_REG_USER_FAILED,
            payload: errorToSend
        });
    }
};

export const selectUserToEdit = (user) => ({
    type: SELECT_USER_TO_EDIT,
    payload: user
});

export const updateUser = (user, id) => async dispatch => {
    try {
        dispatch({type: INIT_ADMIN_UPDATE_USER});
        const res = await axios.put(`/api/users/${id}`, user);
        if(res.status === 200){
            notification('User Updated')
            dispatch({
                type: ADMIN_UPDATE_USER_SUCCEED,
                payload: res.data
            });
        }
    } catch (e) {
        dispatch({
            type: ADMIN_UPDATE_USER_FAILED,
            payload: e.message
        });
    }
};

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({type: INIT_ADMIN_DELETE_USER});
        const {status, data: message = ''} = await axios.delete(`/api/users/${id}`);
        if(status === 200) notification(message)
        const {page, limit} = getState().users;
        dispatch(fetchUsers(+page, +limit));
    } catch (e) {
        dispatch({
            type: ADMIN_DELETE_USER_FAILED,
            payload: e.message
        });
    }
}

export const resetUserSelected = () => ({type: RESET_SELECTED_USER});

export const openModal = () => ({type: OPEN_USER_MODAL});
export const closeModal = () => ({type: CLOSE_USER_MODAL});
