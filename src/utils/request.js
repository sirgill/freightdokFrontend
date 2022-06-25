import axios from 'axios';
import store from "../store";
import {logout} from "../actions/auth";
import {notification} from "../actions/alert";
import {getBaseUrl} from "../config";

const regulateService = (config, callback, showTriggers = true) => {
    return axios(config)
        .then(res => {
            let {data, status} = res;
            if(callback) {
                data = callback(data);
            }
            return {
                success: true, data, status
            }
        })
        .catch(err => {
            const {response = {}} = err,
                {status, data} = response;

            if(status === 401) {
                store.dispatch(logout());
            }
            if(showTriggers && status === 500) {
                notification(response.data.message, 'error');
            }
            if(showTriggers && status === 400) {
                notification(response.data.message, 'error')
            }
            if(!Object.keys(response).length){
                console.log(err.message)
                return {}
            }
            return {
                success: false, data, status
            }
        })
}

const getConfig = (uri, baseUrl, method, data = {}, headers ={}) => {
    return {
        url: uri,
        baseURL: baseUrl,
        headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': "application/json",
            ...headers
        },
        method,
        data
    };
}

export function requestGet({uri, callback, baseUrl = getBaseUrl(), showTriggers}) {
    return regulateService(getConfig(uri, baseUrl, 'GET'), callback, showTriggers)
}

export function requestPut({uri, body, callback, showTriggers, baseUrl = getBaseUrl()}) {
    return regulateService(getConfig(uri, baseUrl, 'PUT', body), callback, showTriggers)
}

export function requestDelete({uri, body, callback, showTriggers, baseUrl = getBaseUrl()}) {
    return regulateService(getConfig(uri, baseUrl, 'DELETE', body), callback, showTriggers)
}

export function requestPatch({uri, body, callback, showTriggers, baseUrl = getBaseUrl()}) {
    return regulateService(getConfig(uri, baseUrl, 'PATCH', body), callback, showTriggers)
}

export function requestPost({uri, body, callback, showTriggers, baseUrl = getBaseUrl()}) {
    return regulateService(getConfig(uri, baseUrl, 'POST', body), callback, showTriggers)
}