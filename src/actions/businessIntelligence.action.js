import {requestGet} from "../utils/request";
import {BUSINESS_INTELLIGENCE, BUSINESS_INTELLIGENCE_HISTORICAL_PERFORMANCE} from "../config/requestEndpoints";
import {serialize, wait} from "../utils/utils";
import {notification} from "./alert";
import {
    IS_BI_LOADING,
    FETCH_BI,
    IS_BI_REFETCHING,
    BI_HISTORICAL_PERFORMANCE,
    BI_HISTORICAL_PERFORMANCE_LOADING
} from "./types";

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

const fetchHistoricalPerformance = async (options = {}) => {
    const uri = `${BUSINESS_INTELLIGENCE_HISTORICAL_PERFORMANCE}?${serialize(options)}`
    return requestGet({uri});
}

export const getHistoricalPerformance = (dateArray) => async (dispatch) => {
    try {
        dispatch({type: BI_HISTORICAL_PERFORMANCE_LOADING, payload: true})
        const promiseRequests = dateArray.map(async ({startDate, endDate}) => {
            return fetchHistoricalPerformance({startDate: startDate.utc(true).toISOString(), endDate: endDate.utc(true).toISOString()})
        })
        await wait(2000);
        const promise = await Promise.all(promiseRequests);
        const data = promise.map((response, i) => {
            const {success, data} = response;
            if(success && data) {
                return {
                    data,
                    dateRange: dateArray[i]
                };
            } else {
                return []
            }
        })

        dispatch({ type: BI_HISTORICAL_PERFORMANCE, payload: data })
    } catch (e) {
        console.log(e)
    }
    finally {
        dispatch({type: BI_HISTORICAL_PERFORMANCE_LOADING, payload: false})
    }
}