import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import load from './load';
import driver from './driver';
import users from './users';

const appReducer = combineReducers({
  alert,
  auth,
  profile,
  load,
  driver,
  users
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer;