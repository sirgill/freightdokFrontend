import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_UPDATE,
  USER_UPDATED,
  AUTH_UPDATE_FAIL
} from '../actions/types';
import {clearUserSettings} from "../components/Atoms/client";

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  roles: [],
  error: '',
};

export default function auth(state = initialState, action) {
  const { type, payload } = action,
    hasToken = localStorage.getItem('token');

  switch(type) {
    case USER_LOADED:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        user: payload.user,
        roles: payload.roles
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: !!hasToken ?? true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_UPDATE:
      return {
        ...state,
        loading: true,
      };
    case USER_UPDATED:
      const updatedUser = payload;
      if (updatedUser.password)
        delete updatedUser.password
      return {
        ...state,
        loading: false,
        user: { ...state.user, ...updatedUser }
      };
    case AUTH_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      clearUserSettings();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
      default:
        return state;
  }
}
