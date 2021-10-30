import { GET_DRIVERS, GET_DRIVER, DRIVER_ERROR, ADD_DRIVER, PATCH_DRIVER, DELETE_DRIVER_LOAD, DELETE_DRIVER } from "../actions/types";

const initialState = {
  drivers: [],
  all_drivers: [],
  driver: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DRIVERS:
      return {
        ...state,
        drivers: payload.drivers,
        all_drivers: payload.users,
        loading: false,
      };
    case GET_DRIVER:
      return {
        ...state,
        driver: payload,
        loading: false,
      };
    case ADD_DRIVER:
      return {
        ...state,
        drivers: [...state.drivers, payload],
        loading: false,
      };
    case DRIVER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case PATCH_DRIVER:
      return {
        ...state,
        drivers: payload,
        loading: false,
      };
    case DELETE_DRIVER:
      return {
        ...state,
        drivers: payload,
        loading: false,
      };
    case DELETE_DRIVER_LOAD:
      return {
        ...state,
        drivers: payload,
        loading: false,
      };
    default:
      return state;
  }
}
