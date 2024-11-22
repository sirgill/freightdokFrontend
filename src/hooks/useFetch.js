import {useEffect, useState} from "react";
import {requestGet} from "../utils/request";
import {serialize} from "../utils/utils";

const useFetch = (url, callback = null, options = {}) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null),
        [isRefetching, setIsRefetching] = useState(false);

    function requestCall() {
        let uri = url
        if (options.queryParams) {
            uri = `${uri}?${serialize(options.queryParams)}`
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

    function onRefetch() {
        setIsRefetching(true);
        requestCall();
    }

    useEffect(() => {
        setLoading(true)
        setError(null);
        requestCall();
    }, [url])

    return {data, loading, error, refetch: onRefetch, isRefetching}
}

export default useFetch;