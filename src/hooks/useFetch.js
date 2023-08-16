import {useEffect, useState} from "react";
import {requestGet} from "../utils/request";

const useFetch = (url, callback = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    function requestCall() {
        requestGet({uri: url, callback, showTriggers: false })
            .then(result => {
                setLoading(false);
                result.data && setData(result.data);
            })
    }

    useEffect(() => {
        setLoading(true)
        setData(null);
        setError(null);
        requestCall();

    }, [url])

    return {data, loading, error, refetch: requestCall}
}

export default useFetch;