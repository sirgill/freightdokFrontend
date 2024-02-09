import {useState} from "react";
import {requestDelete, requestPatch, requestPost, requestPut} from "../utils/request";
import {serialize} from "../utils/utils";

const getRequestCb = (type) => {
    let fn;
    // eslint-disable-next-line default-case
    switch (type) {
        case 'put' : {
            fn = requestPut
            break;
        }
        case 'delete' : {
            fn = requestDelete
            break;
        }
        case 'patch' : {
            fn = requestPatch
            break;
        }
        default: {
            fn = requestPost;
        }
    }
    return fn;
}

const useMutation = (url, callback = null, showTriggers=false, options={}) => {
    const [loading, setLoading] = useState(false);

    const mutation = async (body, type = 'post', afterSubmit) => {
        let uri = url;
        if(options.queryParams){
            uri = uri + "?" + serialize(options.queryParams)
        }
        setLoading(true);
        if(!type){
            type = 'post'
        }
        const asyncApiCall = getRequestCb(type.toLowerCase());
        if(asyncApiCall) {
            return asyncApiCall({uri, callback, body, showTriggers})
                .then(res => {
                    if(afterSubmit){
                        afterSubmit({...res})
                    }
                    return res
                })
                .catch(err => {
                    return err;
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    return { mutation, loading }
}

export default useMutation;