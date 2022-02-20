import axios from 'axios';
import _ from 'lodash';
import {notification, setAlert} from './alert';

import {
  GET_PROFILE,
  PROFILE_ERROR
} from './types';
import {SERVER_ADDRESS} from "./load";

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch(err) {
    console.log(err);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

  }
};

//Create or Update PROFILE_ERROR
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const { image = undefined, company, name, title } = formData;
    const myHeaders = new Headers();
    myHeaders.append("x-auth-token", localStorage.getItem('token'));

    const formdata = new FormData();
    image && formdata.append("file", image[0], image.fileName);
    formdata.append("name", name);
    formdata.append("title", title);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(SERVER_ADDRESS, requestOptions)
        .then(response => response.text())
        .then(result => {
          if(!_.isEmpty(result)) {
            notification(edit ? 'Profile Updated' : 'Profile Created');
            history.push('/dashboard');
            dispatch(getCurrentProfile());
          }
          else {
            notification(result.message, 'error')
          }
        })
        .catch(error => console.log('error', error));


    if(!edit) {
      history.push('/dashboard');
    }

  } catch(err) {
    console.log(err.message)
    // const errors = err.response.data.errors;
    //
    // if(errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    // dispatch({
    //   type: PROFILE_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status }
    // });

  }
}
