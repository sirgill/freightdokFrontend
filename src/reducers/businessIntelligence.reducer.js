import {
    BI_HISTORICAL_PERFORMANCE,
    BI_HISTORICAL_PERFORMANCE_LOADING,
    FETCH_BI,
    IS_BI_LOADING,
    IS_BI_REFETCHING
} from "../actions/types";

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
        data: []
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
                    loading: payload,
                    data: state.historicalPerformance.data
                }
            }
        case BI_HISTORICAL_PERFORMANCE:
            return {
                ...state,
                historicalPerformance: {
                    loading: false,
                    data: payload
                }
            }
        default:
            return {
                ...state
            }
    }
}

export default businessIntelligence