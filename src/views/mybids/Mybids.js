import React, {useEffect, useState} from "react";
import EnhancedTable from "../../components/Atoms/table/Table"
import {useHistory, useRouteMatch} from "react-router"
import {Route, Switch} from "react-router-dom";
import BidDetails from "./bids/BidDetail";
import NewTrulLoadDetails from "../openBoard/NewTrulLoadDetails";
import useFetch from "../../hooks/useFetch";
import {tableConfigCb} from "./bids/config";
import BrokerSetupMessage from "../../components/common/BrokerSetupMessage";


const MyBids = () => {
    const {path} = useRouteMatch()
    const history = useHistory()
    const [params, setParams] = useState({page: 1, limit: 10}),
        {page, limit} = params;
    const {data = {}, loading: dLoading = true, refetch, isRefetching} = useFetch(
            `/api/bid/biddings?page=${page}&limit=${limit}`
        ),
        {data: bidsData = [], totalCount = 0, message} = data || {};

    useEffect(() => {
        //Poll mybids api
        const bidIntervals = setInterval(() => {
            refetch();
        }, 5000);

        return () => clearInterval(bidIntervals);
    }, [page, limit])

    const onPageChange = (event, newPage) => {
        setParams(params => {
            return {...params, page: newPage}
        })
    };


    if (message) {
        return <BrokerSetupMessage message={message}/>
    }

    return (
        <>
            <EnhancedTable
                config={tableConfigCb({history, path, totalCount, onPageChange, page, limit})}
                data={bidsData}
                loading={dLoading}
                onRefetch={refetch} isRefetching={isRefetching}/>
            <Switch>
                <Route
                    path={path + '/bid/:loadNumber'}
                    render={(props) => <BidDetails {...props} onCloseUrl={path} onRefresh={refetch}/>}
                />
                <Route path={path + "/newtrul/:loadId"}
                       render={(props) => <NewTrulLoadDetails {...props} callDetail={false}/>}/>
            </Switch>
        </>
    );
};


export default MyBids;
