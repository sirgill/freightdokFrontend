import React, {useEffect} from "react";
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
    const {data = {}, loading: dLoading = true, refetch, isRefetching} = useFetch('/api/bid/biddings'),
        {data: bidsData = [], totalCount = 0, message, success} = data || {};

    useEffect(() => {
        //Poll mybids api
        const bidIntervals = setInterval(() => {
            refetch();
        }, 5000);

        if(!success){
            clearInterval(bidIntervals)
        }

        return () => clearInterval(bidIntervals);
    }, [success])


    if(message){
        return <BrokerSetupMessage message={message} />
    }

    return (
        <>
            <EnhancedTable config={tableConfigCb(history, path, totalCount)} data={bidsData} loading={dLoading} onRefetch={refetch} isRefetching={isRefetching} />
            <Switch>
                <Route
                    path={path + '/bid/:loadNumber'}
                    render={(props) => <BidDetails {...props} onCloseUrl={path} onRefresh={refetch} />}
                />
                <Route path={path + "/newtrul/:loadId"}
                       render={(props) => <NewTrulLoadDetails {...props} callDetail={false}/>}/>
            </Switch>
        </>
    );
};


export default MyBids;
