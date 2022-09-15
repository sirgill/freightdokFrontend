import axios from "axios";
import {notification} from "./alert";
import {GET_CHROBINSON_LOADS, GET_SHIPMENTS} from "./types";
import {getBaseUrl, getGoUrl, production} from "../config";
import {requestGet, requestPost} from "../utils/request";

export const bookNow = async (body, callback) => {
    try {
        const response = await axios.post(production.goLangBookNow, body);
        const {data} = response;
        if (callback) callback(data);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const getShipments = (payload) => {
    const config = {
        method: "post",
        url: production.goLangServerUrl + "/shipments",
        data: payload,
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        return new Promise((resolve, reject) => {
            axios(config)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error)
                    notification(error.message || '', 'error')
                });
        });
    } catch (e) {
        console.log(e.message);
    }
};

export const getBiddings = (payload) => (dispatch) => {
    const config = {
        method: "get",
        url: getBaseUrl() + "/api/bid/biddings",
        headers: {
            "Content-Type": "application/json",
        },
    };

    dispatch({type: GET_SHIPMENTS, payload: {data: {}, loading: true}});
    try {
        axios(config)
            .then(async function ({data: {data: dbData = []} = {}}) {
                const shipmentsResData = await getShipments(payload);

                const {data: {results = [], totalResults, statusCode, message = ''} = {}} = shipmentsResData;
                if (statusCode === 401) {
                    notification(message, 'error');
                }

                results.forEach(function (shipment, index) {
                    const {loadNumber} = shipment;
                    dbData.forEach(function (bid) {
                        if (
                            parseInt(bid.loadNumber) === loadNumber &&
                            bid.status === true
                        ) {
                            results.splice(index, 1);
                        }
                    });
                });
                //--------------------------
                dispatch({
                    type: GET_SHIPMENTS,
                    payload: {
                        data: {results, totalResults: totalResults},
                        loading: false,
                    },
                });
                //--------------------------
            })
            .catch(function (error) {
                console.log(error);
                notification(error.message, 'error')
                dispatch({
                    type: GET_SHIPMENTS,
                    payload: {data: {}, loading: false, message: error.message},
                });
            });
    } catch (e) {
        console.log(e.message);
    }
};

export const saveCHLoadToDb = async (row = {}, isBooked = false) => {
    try {
        let payload = {isBooked, loadNumber: row.loadNumber, loadDetail: row};
        const response = await axios.post(getBaseUrl() + '/api/chRobinson', payload);
        return response;
    } catch (e) {
        console.log('response', e.response)
    }
}

export const getCHLoads = (onlyDelivered = false) => async (dispatch) => {
    try {
        let {success, data} = await requestGet({uri: '/api/chRobinson'})
        if (success) {
            if (onlyDelivered) {
                const {loads} = data;
                data.loads = loads.filter(load => load.isDelivered)
            }
            dispatch({type: GET_CHROBINSON_LOADS, payload: data});
        }
    } catch (e) {
        console.log(e.message)
    }
}

export const getNewTrulLoads = (pageSize, pageIndex) => async dispatch => {
    dispatch({
        type: GET_SHIPMENTS,
        payload: {
            newTrulLoads: {data: [], totalResults: 0 },
            loading: true,
        },
    });
    const {success, data = {}} = await requestPost({
            uri: '/newTrulGetAllLoads', baseUrl: getGoUrl(),
            body: {
                "page": pageIndex + 1,
                "pagesize": pageSize
            }
        }
    )

    if(success) {
        const {pagination : {total_items} = {}} = data
        console.log('total_items',total_items, data)
        dispatch({
            type: GET_SHIPMENTS,
            payload: {
                data: {results: data.data, totalResults: total_items},
                loading: false,
            },
        });
    }

    if(!success) {
        dispatch({
            type: GET_SHIPMENTS,
            payload: {
                data: {results: [], totalResults: 0 },
                loading: false,
            },
        });
    }

}