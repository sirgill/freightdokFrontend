import React, {useState, useEffect, useCallback, useRef} from 'react';
import _ from 'lodash'
import {requestGet} from "../utils/request";

const useFetchWithSearchPagination = (url, debounceTime = 500) => {
    const [data, setData] = useState([]),
        [loading, setLoading] = useState(false),
        [page, setPage] = useState(1),
        [limit, setLimit] = useState(100),
        [searchQuery, setSearchQuery] = useState(''),
        [isPaginationLoading, setIsPaginationLoading] = useState(false),
        [isSearching, setIsSearching] = useState(false),
        [isRefetching, setIsRefetching] = useState(false),
        isInitialLoad = useRef(true);

    useEffect(() => {
        fetchData();
    }, [url, page, limit]);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        const debouncedSearch = _.debounce(() => {
            if (!isInitialLoad.current) {
                setIsSearching(true);
                fetchData();
            }
        }, debounceTime);

        debouncedSearch();

        return debouncedSearch.cancel;
    }, [searchQuery, debounceTime]);

    const fetchData = useCallback(async () => {
        requestGet({uri: `${url}?page=${page}&search=${searchQuery}&limit=${limit}`})
            .then(res => {
                const {data} = res;
                setData(data);
            })
            .catch(e => {
                console.error(e.message);
            })
            .finally(() => {
                setLoading(false);
                setIsPaginationLoading(false);
                setIsSearching(false);
                setIsRefetching(false);
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                }
            })
    }, [url, page, limit, searchQuery]);

    const onPageChange = useCallback((e, pgNum) => {
        setIsPaginationLoading(true);
        setPage(pgNum);
    }, [])

    const handleSearch = useCallback(({value}) => {
        setSearchQuery(value);
        setPage(1);
    }, []);

    const onLimitChange = useCallback(({value}) => {
        setIsPaginationLoading(true);
        setPage(1);
        setLimit(value);
    }, [])

    const refetch = () => {
        setPage(1);
        setIsRefetching(true);
        fetchData();
    };

    return {
        data,
        loading,
        page,
        limit,
        onPageChange,
        handleSearch,
        refetch,
        onLimitChange,
        searchQuery,
        isPaginationLoading,
        isSearching,
        isRefetching
    };
};

export default useFetchWithSearchPagination