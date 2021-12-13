import axios from "axios"
import { setAlert } from "./alert";
import { FETCH_WAREHOUSEBYID, FETCH_WAREHOUSES, WAREHOUSE_LOCATION } from "./types";

const getWarehouses = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_WAREHOUSES, payload: { loading: true } })

        const response = await axios.get('/api/warehouse');
        const { data, status } = response;
        // console.log(status, data);
        if (status === 200) {
            dispatch({ type: FETCH_WAREHOUSES, payload: { warehouses: data, loading: false } })
        } else {
            throw new Error(response)
        }
    } catch (err) {
        console.log(err)
    }
}

const addWarehouse = (data, callback) => async () => {
    try {
        const response = await axios.post('/api/warehouse', data)
        if (response.status === 200) {
            if (callback) callback(response);
        }
    } catch (error) {

    }
}

const getWarehouseById = (id, cb) => async (dispatch) => {
    try {
        const response = await axios.get('/api/warehouse/' + id);
        if (response.status == 200) {
            dispatch({ type: FETCH_WAREHOUSEBYID, payload: { warehouseById: response.data } });
            if (cb) cb(response.data.data)
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteWarehouse = (id) => async (dispatch) => {
    try {
        const { status, data } = await axios.delete('/api/warehouse/' + id);
        if (status === 200) {
            dispatch(setAlert(data.message || 'Deleted', 'success'));
            dispatch(getWarehouses());
        }
        else {
            dispatch(setAlert(data.message, 'error'))
        };
    } catch (error) {
        console.log(error.message)
        dispatch(setAlert(error.message, 'error'))
    }
}

export const getGeoLocation = (obj) => async (dispatch) => {
    const { status, data } = await axios.post('/api/warehouse/getLocation', obj);
    dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: true } })
    try {
        if (status === 200 && data.success) {
            dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: false, location: { ...data } } });
        }
        else if (!data.success) {
            dispatch(setAlert(data.message, 'error'));
            dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: false, location: {} } });
        }
    } catch (error) {
        dispatch(setAlert(data.message, 'error'));
        dispatch({ type: WAREHOUSE_LOCATION, payload: { loading: false, location: {} } });
    }
}

export {
    addWarehouse,
    getWarehouses,
    deleteWarehouse,
    getWarehouseById,
}