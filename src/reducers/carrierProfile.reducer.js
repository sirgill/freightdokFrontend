import {CARRIER_PROFILE} from "../actions/types";

const initialState = {
    data: [],
    loading: false
}
const carrierProfile = (state = initialState, {type, payload}) => {
    switch (type) {
        case CARRIER_PROFILE:
            return {
                ...state,
                ...payload
            }
        default:
            return {
                ...state
            }
    }
}

export default carrierProfile