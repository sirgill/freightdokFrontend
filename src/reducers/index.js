import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import load from './load';
import driver from './driver';
import users from './users';
import warehouse from '../reducers/warehouse.reducer';
import openBoard from '../reducers/openBoard.reducer';
import {app} from "./app.reducer";

const appReducer = combineReducers({
  alert,
  auth,
  profile,
  load,
  driver,
  users,
  warehouse,
  app,
  openBoard
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer;