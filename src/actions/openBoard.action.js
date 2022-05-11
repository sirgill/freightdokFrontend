import axios from "axios";
import {notification} from "./alert";
import {GET_SHIPMENTS} from "./types";

export const bookNow = async (body) => {
    try {
        const response = await axios.post("https://mail.freightdok.io/sendMail", body);
        const {data, status} = response;
        if (data.success) {
            notification(data.message);
        } else {
            notification(data.message, "error");
        }
    } catch (error) {
        console.log(error);
    }
};

export const getShipments = (payload) => (dispatch) => {
    const config = {
        method: "post",
        url: "https://go.freightdok.io/shipments",
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    dispatch({type: GET_SHIPMENTS, payload: {data: {}, loading: true}})
    try {
        axios(config)
            .then(function (response) {
                dispatch({type: GET_SHIPMENTS, payload: {data: response.data, loading: false}});
            })
            .catch(function (error) {
                console.log(error);
                dispatch({type: GET_SHIPMENTS, payload: {data: {}, loading: false, error: error.message}})
            });
    } catch (e) {
        console.log(e.message);
        dispatch({type: GET_SHIPMENTS, payload: {data: {}, loading: false}})
    }
}