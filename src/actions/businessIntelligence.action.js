import {requestGet} from "../utils/request";
import {
    BUSINESS_INTELLIGENCE,
    BUSINESS_INTELLIGENCE_FINANCIALS,
    BUSINESS_INTELLIGENCE_HISTORICAL_PERFORMANCE
} from "../config/requestEndpoints";
import {serialize, wait} from "../utils/utils";
import {notification} from "./alert";
import {
    IS_BI_LOADING,
    FETCH_BI,
    IS_BI_REFETCHING,
    BI_HISTORICAL_PERFORMANCE,
    BI_HISTORICAL_PERFORMANCE_LOADING,
    BI_FINANCIAL_LOADING,
    BI_FINANCIAL,
    BI_FINANCIAL_ERROR,
    BI_HISTORICAL_PERFORMANCE_ERROR
} from "./types";
import Store from "../store";

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
        let error = false;
        const data = promise.map((response, i) => {
            const {success, data} = response;
            if(success && data) {
                return {
                    data,
                    dateRange: dateArray[i]
                };
            } else {
                error = true
            }
        })
        if(error) {
            dispatch({ type: BI_HISTORICAL_PERFORMANCE_ERROR, payload: {open: true, message: 'No data found', severity: 'error'} })
        }
        else dispatch({ type: BI_HISTORICAL_PERFORMANCE, payload: data })
    } catch (e) {
        dispatch({ type: BI_HISTORICAL_PERFORMANCE_ERROR, payload: {open: true, message: e.err || "Error getting data", severity: 'error'} })
        console.log(e)
    }
    finally {
        dispatch({type: BI_HISTORICAL_PERFORMANCE_LOADING, payload: false})
    }
}

export const getFinancials = (options) => async(dispatch) => {
    try{
        dispatch({type: BI_FINANCIAL_LOADING, payload: true});
        const {success, data} = await requestGet({uri: BUSINESS_INTELLIGENCE_FINANCIALS + `?${serialize(options)}`});
        if(success){
            dispatch({type: BI_FINANCIAL, payload: data})
        } else {
            dispatch({type: BI_FINANCIAL_ERROR, payload: {open: true, message: data.message || "Error getting data", severity: 'error'} })
            dispatch({type: BI_FINANCIAL_LOADING, payload: false});
        }
    } catch (e) {
        dispatch({type: BI_FINANCIAL_ERROR, payload: {open: true, message: e.error || "Error getting results", severity: 'error'}})
        dispatch({type: BI_FINANCIAL_LOADING, payload: false});
    }
    finally {
        dispatch({type: BI_FINANCIAL_LOADING, payload: false});
    }
}

export const closeBIAlert = (type = BI_FINANCIAL_ERROR) => {
    Store.dispatch({type, payload: {open: false, message: null, severity: 'error'}})
}

