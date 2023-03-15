import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { IconButton, Stack } from "@mui/material";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import { LoadDetails } from "./LoadDetails";
import { getBiddings, getNewLoads } from "../../actions/openBoard.action";
import Form from "./Form";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { developmentPayload, productionPayload } from "./constants";
import BookNowForm from "./BookNowForm";
import { addEvent, removeEvent } from "../../utils/utils";
import NewTrulLoadDetails from "./NewTrulLoadDetails";
import NewtrulFilters from "./NewtrulFilters";
import { UserSettings } from "../../components/Atoms/client";
import { Refresh } from "@mui/icons-material";
import { tableConfig } from "./config";
import Dialog from "../../components/Atoms/Dialog";

let payload = developmentPayload;

if (process.env.NODE_ENV === "production") {
    payload = productionPayload;
}

// const CARRIER_CODE = "T2244688";

const OpenBoard = () => {
    const { path } = useRouteMatch(),
        [filters, setFilters] = useState(payload),
        [vendor, setVendor] = useState(UserSettings.getActiveOpenBoard()),
        [params, setParams] = useState(''),
        [dialog, setDialog] = useState({ open: false, content: null }),
        dispatch = useDispatch(),
        { data: { results, totalResults } = {}, loading = false } = useSelector((state) => state.openBoard),
        history = useHistory();

    const getNewTrulList = useCallback((pageSize, pageIndex, params) => {
        // dispatch(getNewTrulLoads(pageSize, pageIndex, params))
    }, [dispatch])

    const getBiddingList = useCallback(() => {
        dispatch(getNewLoads({ ...filters, newTrulQuery: params, env: process.env.NODE_ENV, pageSize: 100 }))
    }, [dispatch, filters, params])

    const onCloseDialog = useCallback(() => {
        setDialog((prev) => ({ ...prev, open: false }))
    }, [])

    const showDialog = (dialogProps) => {
        setDialog((prev) => ({ ...dialogProps, open: true }));
    }

    const modifyChRobinsonFilters = (filters) => {
        const { destination, origin } = filters;
        if (destination) {
            filters.destinations = [
                {
                    countryCode: "US",
                    stateCodes: destination.split(",")
                },
            ]
        }
        if (origin) {
            filters.origins = [
                {
                    countryCode: "US",
                    stateCodes: origin.split(","),
                },
            ];
        }
        delete filters.origin;
        delete filters.destination;
        return filters;

    }

    const onFilterChange = (fromDate, toDate, type) => {
        if (fromDate.name === "origin" || fromDate.name === "destination") {
            const filtersAltered = { ...filters, [fromDate.name]: fromDate.value }
            setFilters(filtersAltered)
            return
        }
        if (fromDate === 'select') {
            UserSettings.setActiveOpenBoard('activeBoard', toDate.target.value)
            setFilters(payload)
            return setVendor(toDate.target.value)
        }
        const min = moment(fromDate).format('YYYY-MM-DD')
        const max = moment(toDate).format('YYYY-MM-DD')
        const availableForPickUpByDateRange = {
            min,
            max
        }
        setFilters({ ...filters, availableForPickUpByDateRange })
    }
    const submitFilters = useCallback((e) => {
        e.preventDefault()
        getBiddingList();
    }, [getBiddingList])

    useEffect(() => {
        getBiddingList();
        addEvent(window, 'getBiddings', getBiddingList);

        return () => removeEvent(window, 'getBiddings', getBiddingList);
    }, [dispatch, filters, getBiddingList]);

    // useEffect(() => {
    //     if (vendor === 'newTrul') {
    //         const { pageSize, pageIndex } = filters;
    //         getNewTrulList(pageSize, pageIndex)
    //     } else getBiddingList()
    //     // eslint-disable-next-line no-extend-native
    // }, [vendor])// eslint-disable-next-line no-extend-native

    const onPageChange = (e, pgNum) => {
        setFilters(() => ({ ...filters, pageIndex: pgNum - 1 }));
    };

    return (
        <Stack style={{ gap: '10px' }}>
            <Stack direction={'row'} justifyContent='end'>
                <Stack>
                    <IconButton title='Refresh' onClick={getBiddingList}>
                        <Refresh className={loading ? 'rotateIcon' : undefined} />
                    </IconButton>
                </Stack>
            </Stack>
            <NewtrulFilters
                setParams={setParams}
                setFilters={setFilters}
                pageSize={filters.pageSize}
                pageIndex={filters.pageIndex}
                getNewTrulList={getNewTrulList}
            />
            <EnhancedTable
                config={tableConfig({ showDialog, history, path, totalResults, onPageChange, vendor, pageSize: filters.pageSize, pageIndex: filters.pageIndex })}
                data={results || []}
                loading={loading}
            />
            <Route path={path + "/newtrul/:loadId"} component={NewTrulLoadDetails} />
            <Route path={path + "/:loadNumber"} exact component={LoadDetails} />
            <Route path={path + "/:loadNumber/bid"} component={Form} />
            <Route path={path + "/:loadNumber/bookNow"} component={BookNowForm} />
            <Dialog onClose={onCloseDialog} config={dialog} />
        </Stack>
    );
};

export default withRouter(OpenBoard);
