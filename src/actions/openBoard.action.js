import axios from "axios";
import {notification} from "./alert";
import {GET_CHROBINSON_LOADS, GET_SHIPMENTS} from "./types";
import {getBaseUrl, getGoUrl, production} from "../config";
import {requestGet, requestPost} from "../utils/request";

export const bookNow = async (loadNumber, body, callback) => {
    try {
        const response = await axios.post(getGoUrl() + '/CHBidding' + `?loadNumber=${loadNumber}`, body);
        const { data, success } = response;
        if (callback) callback(success, data);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const placeNewTrulBid = async (body, loadNumber, callback) => {
    try {
        const { success, data } = await requestPost({ uri: "/api/bid/newTrulBidding/" + loadNumber, body });
        if (success) {
            delete body.loadDetail;
            const { success, data } = await requestPost({ baseUrl: getGoUrl(), uri: '/newTrulBidLoad', body })
            if (success) {
                notification('Bid submitted successfully');
            }
            if (callback) callback(success, data);
            if (data.status === 'error') {
                notification(data.message, 'error')
            }
        } else {
            notification(data.message, 'error')
        }
    } catch (e) {
        console.log(e.message)
    }
}

export const placeNewTrulCounterOffer = (body, callback) => async () => {
    try {
        const { success, data } = await requestPost({ baseUrl: getGoUrl(), uri: '/newTrulCounterOffer', body });
        if (callback) callback(success, data);
    } catch (e) {
        console.log(e.message);
        notification(e.message, 'error')
    }
}

export const newTrulFinalOffer = (body, callback) => async () => {
    try {
        const { success, data } = await requestPost({ baseUrl: getGoUrl(), uri: '/newTrulFinalOffer', body });
        if (callback) callback(success, data);
    } catch (e) {
        console.log(e.message);
        notification(e.message, 'error')
    }
}

export const getShipments = (payload) => {
    const config = {
        method: "post",
        url: getGoUrl() + "/shipments",
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

export const getAllBiddings = async () => {
    try {
        const { success, data } = await requestGet({ uri: '/api/bid/biddings' })
        if (success) return data;
        else {
            return {
                totalCount: 0,
                data: []
            }
        }
    } catch (e) {

    }
}

export const getBiddings = (payload) => (dispatch) => {
    const config = {
        method: "get",
        url: getBaseUrl() + "/api/bid/biddings",
        headers: {
            "Content-Type": "application/json",
        },
    };

    dispatch({ type: GET_SHIPMENTS, payload: { data: {}, loading: true } });
    try {
        axios(config)
            .then(async function ({ data: { data: dbData = [] } = {} }) {
                const shipmentsResData = await getShipments(payload);

                const { data: { results = [], totalResults, statusCode, message = '' } = {} } = shipmentsResData;
                if (statusCode === 401) {
                    notification(message, 'error');
                }

                results.forEach(function (shipment, index) {
                    const { loadNumber } = shipment;
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
                        data: { results, totalResults: totalResults },
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
                    payload: { data: {}, loading: false, message: error.message },
                });
            });
    } catch (e) {
        console.log(e.message);
    }
};

export const saveCHLoadToDb = async (row = {}, isBooked = false) => {
    try {
        let payload = { isBooked, loadNumber: row.loadNumber, loadDetail: row };
        return await axios.post(getBaseUrl() + '/api/chRobinson', payload);
    } catch (e) {
        console.log('response', e.response)
    }
}

export const getCHLoads = (onlyDelivered = false) => async (dispatch) => {
    try {
        let { success, data } = await requestGet({ uri: '/api/chRobinson' })
        if (success) {
            if (onlyDelivered) {
                const { loads } = data;
                data.loads = loads.filter(load => load.isDelivered)
            }
            dispatch({ type: GET_CHROBINSON_LOADS, payload: data });
        }
    } catch (e) {
        console.log(e.message)
    }
}

export const getNewTrulLoads = (pageSize, pageIndex, params) => async dispatch => {
    dispatch({
        type: GET_SHIPMENTS,
        payload: {
            newTrulLoads: { data: [], totalResults: 0 },
            loading: true,
        },
    });
    const { data: allBiddings } = await getAllBiddings();
    const { success, data = {} } = await requestPost({
        uri: '/newTrulGetAllLoads', baseUrl: getGoUrl(),
        body: {
            "page": pageIndex + 1,
            "pagesize": pageSize,
            "params": params ? params : ''
        }
    }
    )

    if (success) {
        const { pagination: { total_items } = {}, data: list = [] } = data
        if (allBiddings) {
            list.forEach(load => {
                allBiddings.forEach(bidding => {
                    if (+bidding.loadNumber === +load.id) {
                        load.bidAmount = bidding.bidAmount;
                        load.bidLevel = bidding.bidLevel;
                        load.status = bidding.status;
                    }
                })
            })
        }
        dispatch({
            type: GET_SHIPMENTS,
            payload: {
                data: { results: list, totalResults: total_items },
                loading: false,
            },
        });
    }

    if (!success) {
        notification(data.message, 'error')
        dispatch({
            type: GET_SHIPMENTS,
            payload: {
                data: { results: [], totalResults: 0 },
                loading: false,
            },
        });
    }

}