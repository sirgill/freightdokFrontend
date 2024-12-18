import {requestGet} from "../utils/request";
import {BUSINESS_INTELLIGENCE} from "../config/requestEndpoints";
import {serialize} from "../utils/utils";
import {notification} from "./alert";
import {IS_BI_LOADING, FETCH_BI, IS_BI_REFETCHING} from "./types";

export const fetchBI = (options, isRefetch) => async (dispatch) => {
    try {
        isRefetch ? dispatch({type: IS_BI_REFETCHING, payload: true}) : dispatch({type: IS_BI_LOADING, payload: true})
        const uri = `${BUSINESS_INTELLIGENCE}?${serialize(options)}`
        const {data, success} = await requestGet({uri});

        dispatch({type: FETCH_BI, payload: {data, success}});
        isRefetch ? dispatch({type: IS_BI_REFETCHING, payload: false}) : dispatch({type: IS_BI_LOADING, payload: false})
    } catch (e) {
        notification(e.message, 'error')
        isRefetch ? dispatch({type: IS_BI_REFETCHING, payload: false}) : dispatch({type: IS_BI_LOADING, payload: false})
    }
}