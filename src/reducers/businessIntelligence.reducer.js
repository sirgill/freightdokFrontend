import {FETCH_BI, IS_BI_LOADING, IS_BI_REFETCHING} from "../actions/types";

const initialState = {
    loading: false,
    isRefetching: false,
    businessIntelligenceData: {
        success: true, data: {}
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
        default:
            return {
                ...state
            }
    }
}

export default businessIntelligence