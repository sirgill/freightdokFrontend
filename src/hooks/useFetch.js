import {useEffect, useState} from "react";
import {requestGet} from "../utils/request";

const useFetch = (url, callback = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null),
        [isRefetching, setIsRefetching] = useState(false);


    function requestCall() {
        requestGet({uri: url, callback, showTriggers: false })
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
        setData(null);
        setError(null);
        requestCall();

    }, [url])

    return {data, loading, error, refetch: onRefetch, isRefetching}
}

export default useFetch;