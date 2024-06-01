import React, {useState, useEffect} from 'react';
import _ from 'lodash'
import {requestGet} from "../utils/request";

const useFetchWithSearchPagination = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPaginationLoading, setIsPaginationLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    useEffect(() => {
        fetchData();
    }, [url, page, limit]);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        const debouncedSearch = _.debounce(() => {
            fetchData();
            setIsSearching(true);
        }, 500);

        debouncedSearch();

        return debouncedSearch.cancel;
    }, [searchQuery]);

    const fetchData = async () => {
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
            })
    };

    const onPageChange = (e, pgNum) => {
        setIsPaginationLoading(true);
        setPage(pgNum);
    }

    const handleSearch = ({value}) => {
        setSearchQuery(value);
        setPage(1);
    };

    const onLimitChange = ({value}) => {
        setIsPaginationLoading(true);
        setLimit(value);
    }

    const refetch = () => {
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