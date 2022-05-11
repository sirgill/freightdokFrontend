import { GET_SHIPMENTS,} from "../actions/types";

const initialState = {
    shipments: {}
}
const openBoardReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_SHIPMENTS:
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

export default openBoardReducer