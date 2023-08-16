import {useState} from "react";
import {requestDelete, requestPatch, requestPost, requestPut} from "../utils/request";

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

const useMutation = (url, callback = null) => {
    const [loading, setLoading] = useState(false);

    const mutation = async (body, type = 'post') => {
        setLoading(true);
        const asyncApiCall = getRequestCb(type.toLowerCase());
        if(asyncApiCall) {
            return asyncApiCall({uri: url, callback, body})
                .then(res => res)
                .catch(err => {
                    return err;
                });
        }
    }

    return { mutation, loading }
}

export default useMutation;