import { FETCH_WAREHOUSEBYID, FETCH_WAREHOUSES } from "../actions/types";

const initialState = {
    totalCount: 0,
    warehouses: []
}
const warehouse = (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_WAREHOUSES:
            return {
                ...state,
                ...payload
            }
        case FETCH_WAREHOUSEBYID:
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

export default warehouse