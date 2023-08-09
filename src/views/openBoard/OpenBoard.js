import React, {useCallback, useEffect, useMemo, useState} from "react";
import {IconButton, Stack} from "@mui/material";
import {Route, useHistory, useRouteMatch} from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import {LoadDetails} from "./LoadDetails";
import {getNewLoads} from "../../actions/openBoard.action";
import Form from "./Form";
import {withRouter} from "react-router-dom/cjs/react-router-dom.min";
import {useDispatch, useSelector} from "react-redux";
import {developmentPayload, productionPayload} from "./constants";
import BookNowForm from "./BookNowForm";
import {addEvent, removeEvent} from "../../utils/utils";
import NewTrulLoadDetails from "./NewTrulLoadDetails";
import NewtrulFilters from "./NewtrulFilters";
import {UserSettings} from "../../components/Atoms/client";
import {Refresh} from "@mui/icons-material";
import {tableConfig} from "./config";
import Dialog from "../../components/Atoms/Dialog";

let payload = developmentPayload;

if (process.env.NODE_ENV === "production") {
    payload = productionPayload;
}

// const CARRIER_CODE = "T2244688";

const OpenBoard = () => {
    const {path} = useRouteMatch(),
        [filters, setFilters] = useState(payload),
        [vendor, setVendor] = useState(UserSettings.getActiveOpenBoard()),
        [params, setParams] = useState(''),
        [dialog, setDialog] = useState({open: false, content: null}),
        dispatch = useDispatch(),
        {data: {results, totalResults} = {}, loading = false} = useSelector((state) => state.openBoard),
        history = useHistory();

    const getNewTrulList = useCallback(() => {
        // dispatch(getNewTrulLoads(pageSize, pageIndex, params))
    }, [])

    const getBiddingList = useCallback(() => {
        dispatch(getNewLoads({...filters, newTrulQuery: params, env: process.env.NODE_ENV, pageSize: 100}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, filters, params])

    const onCloseDialog = useCallback(() => {
        setDialog((prev) => ({...prev, open: false}))
    }, [])

    const showDialog = useCallback(({content}) => {
        setDialog((prev) => ({...prev, open: true, content}));
    }, [])

    useEffect(() => {
        getBiddingList();
        addEvent(window, 'getBiddings', getBiddingList);

        return () => removeEvent(window, 'getBiddings', getBiddingList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);


    const onPageChange = (e, pgNum) => {
        setFilters(() => ({...filters, pageIndex: pgNum - 1}));
    };

    const table = useMemo(() => <EnhancedTable
        config={tableConfig({showDialog, history, path, totalResults, onPageChange, vendor, pageSize: filters.pageSize, pageIndex: filters.pageIndex })}
        data={results || []}
        loading={loading}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    />, [results])

    return (
        <Stack style={{gap: '10px'}}>
            <Stack direction={'row'} justifyContent='end'>
                <Stack>
                    <IconButton title='Refresh' onClick={getBiddingList}>
                        <Refresh className={loading ? 'rotateIcon' : undefined}/>
                    </IconButton>
                </Stack>
            </Stack>
            <NewtrulFilters
                defaultParams={payload}
                setParams={setParams}
                setFilters={setFilters}
                pageSize={filters.pageSize}
                pageIndex={filters.pageIndex}
                getNewTrulList={getNewTrulList}
            />
            {table}
            <Route path={path + "/newtrul/:loadId"} component={NewTrulLoadDetails}/>
            <Route path={path + "/:loadNumber"} exact component={LoadDetails}/>
            <Route path={path + "/:loadNumber/bid"} component={Form}/>
            <Route path={path + "/:loadNumber/bookNow"} component={BookNowForm}/>
            <Dialog onClose={onCloseDialog} config={dialog}/>
        </Stack>
    );
};

export default withRouter(OpenBoard);
