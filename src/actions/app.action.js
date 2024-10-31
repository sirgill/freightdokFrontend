import {APP_VARIABLES} from "./types";

export const buildAppVariables = () => async (dispatch) => {
    const {
        NODE_ENV,
        PUBLIC_URL,
        REACT_APP_babylonianServerUrl,
        REACT_APP_goLangMail,
        REACT_APP_goLangServerUrl,
        REACT_APP_mailServerUrl,
        REACT_APP_mainServerUrl,
        REACT_APP_nodeServerUrl
    } = process.env;
    const obj = {
        env: NODE_ENV,
        babylonianServerUrl: REACT_APP_babylonianServerUrl,
        goLangMail: REACT_APP_goLangMail,
        host_url: REACT_APP_mainServerUrl,
        goLangServerUrl: REACT_APP_goLangServerUrl,
        mailServerUrl: REACT_APP_mailServerUrl
    }
    dispatch({type: APP_VARIABLES, payload: obj});
}