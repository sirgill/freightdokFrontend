import axios from "axios"
import {notification} from "./alert";
import { FETCH_WAREHOUSEBYID, FETCH_WAREHOUSES, WAREHOUSE_LOCATION } from "./types";

const getWarehouses = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_WAREHOUSES, payload: { loading: true } })

        const response = await axios.get('/api/warehouse');
        const { data, status } = response;
        // console.log(status, data);
        if (status === 200) {
            dispatch({ type: FETCH_WAREHOUSES, payload: { warehouses: data, loading: false } })
        }
    } catch (err) {
        console.log(err)
    }
}

const getWarehouseById = (id, cb) => async (dispatch) => {
    try {
        const response = await axios.get('/api/warehouse/' + id);
        if (response.status === 200) {
            dispatch({ type: FETCH_WAREHOUSEBYID, payload: { warehouseById: response.data } });
            if (cb) cb(response.data.data)
        }
    } catch (error) {
        console.log(error);
    }
}

export const geoLocationService = async (obj) =>  {
    return await axios.post('/api/warehouse/getLocation', obj)
}

export const getGeoLocation = (obj) => async (dispatch) => {
    const { status, data } = await geoLocationService(obj);
    dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: true } })
    try {
        if (status === 200 && data.success) {
            dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: false, location: { ...data } } });
        }
        else if (!data.success) {
            notification(data.message, 'error');
            dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: false, location: {} } });
        }
    } catch (error) {
        notification(data.message, 'error');
        dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: false, location: {} } });
    }
}

export {
    getWarehouses,
    getWarehouseById,
}