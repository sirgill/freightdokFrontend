import { FETCH_WAREHOUSEBYID, FETCH_WAREHOUSES, WAREHOUSE_LOCATION } from "../actions/types";

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
        case WAREHOUSE_LOCATION:
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