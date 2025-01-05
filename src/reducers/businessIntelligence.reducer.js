import {
    BI_FINANCIAL, BI_FINANCIAL_ERROR, BI_FINANCIAL_LOADING,
    BI_HISTORICAL_PERFORMANCE, BI_HISTORICAL_PERFORMANCE_ERROR,
    BI_HISTORICAL_PERFORMANCE_LOADING,
    FETCH_BI,
    IS_BI_LOADING,
    IS_BI_REFETCHING
} from "../actions/types";

const error = {show: false, message: null, severity: 'error'}
const initialState = {
    loading: false,
    isRefetching: false,
    businessIntelligenceData: {
        success: true, data: {
            revenue: null,
            averageRate: null,
            loadCount: null,
            overview: []
        }
    },
    historicalPerformance: {
        loading: true,
        data: [],
        error
    },
    financials: {
        loading: true,
        data: {},
        error
    }
}
const businessIntelligence = (state = initialState, {type, payload}) => {
    switch (type) {
        case FETCH_BI:
            return {
                ...state,
                businessIntelligenceData: payload
            }
        case IS_BI_LOADING:
            return {
                ...state,
                loading: payload
            }
        case IS_BI_REFETCHING:
            return {
                ...state,
                isRefetching: payload
            }
        case BI_HISTORICAL_PERFORMANCE_LOADING:
            return {
                ...state,
                historicalPerformance: {
                    ...state.historicalPerformance,
                    loading: payload,
                }
            }
        case BI_HISTORICAL_PERFORMANCE:
            return {
                ...state,
                historicalPerformance: {
                    ...state.historicalPerformance,
                    data: payload
                }
            }
        case BI_HISTORICAL_PERFORMANCE_ERROR:
            return {
                ...state,
                historicalPerformance: {
                    ...state.historicalPerformance,
                    error: payload
                }
            }
        case BI_FINANCIAL_LOADING:
            return {
                ...state,
                financials: {
                    ...state.financials,
                    loading: payload,
                }
            }
        case BI_FINANCIAL:
            return {
                ...state,
                financials: {
                    loading: false,
                    data: payload,
                    error: null
                }
            }
        case BI_FINANCIAL_ERROR:
            return {
                ...state,
                financials: {
                    ...state.financials,
                    error: payload
                }
            }
        default:
            return {
                ...state
            }
    }
}

export default businessIntelligence