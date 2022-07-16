import {GET_CHROBINSON_LOADS, GET_SHIPMENTS,} from "../actions/types";

const initialState = {
    shipments: {},
    chRobinsonLoads: {
        totalCount: 0,
        loads: []
    }
}
const openBoardReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_SHIPMENTS:
            return {
                ...state,
                ...payload
            }
        case GET_CHROBINSON_LOADS:
            return {
                ...state,
                chRobinsonLoads: payload
            }
        default:
            return {
                ...state
            }
    }
}

export default openBoardReducer