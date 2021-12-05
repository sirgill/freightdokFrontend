import axios from "axios"
import { FETCH_WAREHOUSEBYID, FETCH_WAREHOUSES } from "./types";

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

export {
    addWarehouse,
    getWarehouses,
    getWarehouseById
}