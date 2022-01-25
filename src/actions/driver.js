import axios from "axios";
import { setAlert } from "./alert";
import { GET_DRIVERS, GET_DRIVER, ADD_DRIVER, PATCH_DRIVER, DELETE_DRIVER, DRIVER_ERROR, DELETE_DRIVER_LOAD } from "./types.js";

//get current users drivers
export const getDrivers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/drivers/me");
    dispatch({
      type: GET_DRIVERS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: DRIVER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//add load
export const addDriver = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("===================")
    const res = await axios.post("/api/drivers", formData, config);

    dispatch({
      type: ADD_DRIVER,
      payload: res.data,
    });

    dispatch(setAlert("Driver Created", "success"));
  } catch (err) {
    let error = err.errors && Array.isArray(err.errors) && err.errors.length ? err.errors[0].msg : err.message;
    dispatch(setAlert( error, "error"));
    // dispatch({
    //   type: DRIVER_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status },
    // });
  }
};

//patch driver
export const patchDriverLoads = (driver_id, loads) => async (dispatch, getState) => {
  try {
    let drivers = getState().driver.drivers;
    const res = await axios.patch(`/api/drivers/loads?driver_id=${driver_id}`, { loads: loads });
    let index = drivers.indexOf(drivers.find((o) => o._id === res.data._id));
    if (index !== -1) {
      drivers[index] = res.data;
    }
    dispatch({
      type: PATCH_DRIVER,
      payload: drivers,
    });
  } catch (err) {
    dispatch({
      type: DRIVER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//delete driver
export const deleteDriver = (driver_id) => async (dispatch, getState) => {
  try {
    let drivers = getState().driver.drivers;
    const res = await axios.delete(`/api/drivers/`, { data: { driver_id: driver_id } });
    let index = drivers.indexOf(drivers.find((o) => o._id === res.data._id));
    if (index !== -1) {
      drivers.splice(index, 1);
    }
    dispatch(setAlert('Deleted Successfully', 'success'));
    dispatch({
      type: DELETE_DRIVER,
      payload: drivers,
    });
  } catch (err) {
    dispatch({
      type: DRIVER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//delete driver load
export const deleteDriverLoads = (driver_id, load_id) => async (dispatch, getState) => {
  try {
    let drivers = getState().driver.drivers;
    const res = await axios.delete(`/api/drivers/loads`, { data: { load_id: load_id, driver_id: driver_id } });
    let index = drivers.indexOf(drivers.find((o) => o._id === res.data._id));
    if (index !== -1) {
      drivers[index] = res.data;
    }
    dispatch({
      type: DELETE_DRIVER_LOAD,
      payload: drivers,
    });
  } catch (err) {
    dispatch({
      type: DRIVER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
