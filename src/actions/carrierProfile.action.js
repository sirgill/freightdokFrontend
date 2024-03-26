import {requestGet} from "../utils/request";
import {CARRIER_PROFILE} from "./types";
import {getUserDetail} from "../utils/utils";

const {orgId} = getUserDetail().user;
export const getCarrierProfile = () => async (dispatch) => {
    dispatch({ type: CARRIER_PROFILE, payload: {loading: true, data: {} }})
    try {
        const {data} = await requestGet({uri: '/api/organizations?orgId='+orgId})
        dispatch({ type: CARRIER_PROFILE, payload: {loading: false, data: data.data }})
    } catch (error) {
        console.log(error);
        dispatch({ type: CARRIER_PROFILE, payload: {loading: false, data: {} }})

    }
};