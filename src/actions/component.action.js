import store from "../store";
import {DELETE_COMPONENT} from "./types";


const showDelete = ({message, uri, afterSuccessCb}) => {
    store.dispatch({type: DELETE_COMPONENT, payload: {open: true, message, uri, afterSuccessCb}})
}

const removeDelete = () => {
    const data = store.getState().app.deleteComponent;
    store.dispatch({type: DELETE_COMPONENT, payload: {...data, open: false}})
}

export {
    showDelete,
    removeDelete
}