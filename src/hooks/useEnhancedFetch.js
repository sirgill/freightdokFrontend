import {useEffect, useState} from "react";
import {requestGet} from "../utils/request";
import {serialize} from "../utils/utils";

const useEnhancedFetch = (url, options = {}, callback = null) => {
    const {showPagination = true, page, limit} = options,
        [data, setData] = useState(undefined);
    const [pageOptions, setPageOptions] = useState({page: (page || 1), limit: (limit || 10)});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null),
        [isRefetching, setIsRefetching] = useState(false)

    function requestCall(object) {
        const {page, limit} = object || {};
        let uri = url;
        if(showPagination){
            if(page && limit){
                setPageOptions({page, limit})
            }
            uri = `${uri}?page=${page || pageOptions.page}&limit=${limit || pageOptions.limit}`
        }
        if (options.queryParams) {
            uri = `${uri}&${serialize(options.queryParams)}`
        }
        requestGet({uri, callback, showTriggers: false})
            .then(result => {
                result.data && setData(result.data);
            })
            .finally(() => {
                setLoading(false);
                setIsRefetching(false);
            })
    }

    const onLimitChange = ({value}) => {
        // setPageOptions({...pageOptions, limit: value});
        requestCall({limit: value, page: pageOptions.page})
    }

    const onPageChange = (e, pgNum) => {
        // setPageOptions({...pageOptions, page: pgNum});
        requestCall({page: pgNum, limit: pageOptions.limit})
    }

    function onRefetch() {
        setIsRefetching(true);
        requestCall({page, limit: pageOptions.limit});
    }

    useEffect(() => {
        setLoading(true)
        setData(null);
        setError(null);
        requestCall();
    }, [url])

    return {data, loading, error, refetch: onRefetch, isRefetching,
        onLimitChange, onPageChange, ...pageOptions
    }
}

export default useEnhancedFetch;