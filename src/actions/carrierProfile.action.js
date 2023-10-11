import {requestGet} from "../utils/request";
import {CARRIER_PROFILE} from "./types";

export const getCarrierProfile = () => async (dispatch) => {
    dispatch({ type: CARRIER_PROFILE, payload: {loading: true, data: {} }})
    try {
        const {data} = await requestGet({uri: '/api/carrierProfile'})
        dispatch({ type: CARRIER_PROFILE, payload: {loading: false, data: data.data }})
    } catch (error) {
        console.log(error);
        dispatch({ type: CARRIER_PROFILE, payload: {loading: false, data: {} }})

    }
};