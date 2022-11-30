import {
    FETCH_USERS,
    FETCH_USERS_SUCCEED,
    FETCH_USERS_FAILED,
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
} from '../actions/types';

const initialState = {
    loading: false,
    open: false,
    list: [],
    user: null,
    error: '',
    total: 0,
    page: 0,
    totalPages: 0,
    limit: 5
};

export default function users(state = initialState, action) {
    const { type, payload } = action;
  
    switch(type) {
        case OPEN_USER_MODAL:
            return { ...state, open: true }
        case CLOSE_USER_MODAL:
            return { ...state, open: false }
        case FETCH_USERS:
            return {
                ...state,
                loading: true
            };
        case ADMIN_REG_USER:
            return {
                ...state,
                loading: true
            };
        case INIT_ADMIN_UPDATE_USER:
            return {
                ...state,
                loading: true
            };
        case INIT_ADMIN_DELETE_USER:
            return {
                ...state,
                loading: true
            };
        case SELECT_USER_TO_EDIT:
            return {
                ...state,
                user: payload
            };
        case RESET_SELECTED_USER:
            return {
                ...state,
                user: null,
                open: false
            };
        case FETCH_USERS_SUCCEED:
            return {
                ...state,
                loading: false,
                open: false,
                list: payload.users,
                page: payload.currentPage,
                limit:  payload.limit,
                pages: payload.totalPages,
                total: payload.total
            };
        case ADMIN_REG_USER_SUCCEED:
            return {
                ...state,
                loading: false,
                open: false,
                page: 0,
                error: ''
            };
        case ADMIN_UPDATE_USER_SUCCEED:
            return {
                ...state,
                loading: false,
                error: '',
                open: false,
                user: null,
                list: state.list.map(user => {
                    if (user._id === payload._id)
                        return payload;
                    return user;
                })
            }
        case ADMIN_DELETE_USER_SUCCEED:
            return {
                ...state,
                loading: false,
                error: ''
            };
        case FETCH_USERS_FAILED:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case ADMIN_REG_USER_FAILED:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case ADMIN_UPDATE_USER_FAILED:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case ADMIN_DELETE_USER_FAILED:
            return {
                ...state,
                loading: false
            };
        default:
          return state;
    }
}
  