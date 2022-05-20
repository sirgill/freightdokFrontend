import React, {Fragment, useEffect, useState} from "react";
import moment from 'moment';
import {Button} from "@mui/material";
import {Route, useHistory, useRouteMatch} from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import LoadDetails from "./LoadDetails";
import {
    bookNow,
    getBiddings,
} from "../../actions/openBoard.action";
import Form from "./Form";
import {withRouter} from "react-router-dom/cjs/react-router-dom.min";
import {useDispatch, useSelector} from "react-redux";

const payload = JSON.stringify({
    pageIndex: 0,
    pageSize: 20,
    regionCode: "NA",
    modes: ["V", "R"],
    carrierCode: "T2244688",
});

const OpenBoard = () => {
    const {path} = useRouteMatch(),
        [filters, setFilters] = useState({
            regionCode: "NA", modes: ["V", "R"], carrierCode: "T2244688",pageIndex: 0, pageSize: 100
        }),
        dispatch = useDispatch(),
        {data: {results, totalResults} = {}, loading = false} = useSelector(
            (state) => state.openBoard
        ),
        history = useHistory();

    useEffect(() => {
        dispatch(getBiddings(filters));
    }, [dispatch, filters]);

    const afterBookNow = ({success = false}) => {
        if (success) {
            dispatch(getBiddings(filters));
        }
    };

    const handleBookNow = (row, e) => {
        e.stopPropagation();
        Object.assign(row, {defaultEmail: "vy4693@gmail.com", env: "dev"});
        bookNow(row, afterBookNow);
    };

    const onPageChange = (e, pgNum) => {
        setFilters({...filters, pageIndex: pgNum - 1})
    }

    const tableConfig = {
        rowCellPadding: "inherit",
        emptyMessage: "No Shipments Found",
        onRowClick: ({loadNumber}) => `${path}/${loadNumber}`,
        count: totalResults,
        limit: filters.pageSize,
        page: filters.pageIndex,
        onPageChange,
        columns: [
            {
                id: "loadNumber",
                label: "Load Number",
                renderer: ({row}) => {
                    return <Fragment>{row.loadNumber}</Fragment>;
                },
            },
            {
                id: "country",
                label: "Pickup City/State",
                renderer: ({row}) => {
                    return (
                        <Fragment>
                            {row.origin.city}, {row.origin.stateCode}
                        </Fragment>
                    );
                },
            },
            {
                id: "pickupDate",
                label: "Pickup Date",
                renderer: ({row}) => {
                    let date = ''
                    if(moment(row.pickUpByDate).isValid()){
                        date = moment(row.pickUpByDate).format('M/DD/YYYY')
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "deliveryCountry",
                label: "Delivery City/State",
                renderer: ({row}) => {
                    return (
                        <Fragment>
                            {row.destination.city}, {row.destination.stateCode}
                        </Fragment>
                    );
                },
            },
            {
                id: "deliveryDate",
                label: "Delivery Date",
                renderer: ({row}) => {
                    let date = '';
                    if(moment(row.deliverBy).isValid()){
                        date = moment(row.deliverBy).format('M/DD/YYYY')
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "equipment",
                label: "Equipment",
                renderer: ({row}) => {
                    let {equipment: {length: {standard = ''} = {}} = {}, modes = []} = row || {},
                        modesString = modes.join(', ');
                    if (standard) {
                        standard = standard + 'ft';
                    }
                    if (modesString) {
                        modesString = modesString + ","
                    }
                    return <Fragment>{modesString} {standard}</Fragment>;
                },
            },
            {
                id: "weight",
                label: "Weight",
                renderer: ({row}) => {
                    let {weight: {pounds = ''} = {}} = row || {};
                    if(pounds) pounds = pounds + ' lbs'
                    return <Fragment>{pounds}</Fragment>;
                },
            },
            {
                id: "company",
                label: "Company",
                renderer: ({row}) => {
                    return <Fragment>{'C.H Robinson'}</Fragment>;
                },
            },
            {
                id: "bookNow",
                label: "Book Now",
                renderer: ({row = {}}) => {
                    if (row.hasOwnProperty("availableLoadCosts")) {
                        const {availableLoadCosts = []} = row || {};
                        const [item] = availableLoadCosts || [];
                        if (item) {
                            return (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleBookNow.bind(this, row)}
                                >
                                    $ {item.sourceCostPerUnit}
                                </Button>
                            );
                        }
                    }
                    return null;
                },
            },
            {
                id: "Bidding",
                label: "Bid",
                renderer: ({row}) => {
                    return (
                        <Fragment>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    history.push(path + `/${row.loadNumber}/bid`, row);
                                }}
                            >
                                Bid +
                            </Button>
                        </Fragment>
                    );
                },
            },
        ],
    };

    return (
        <div>
            <EnhancedTable
                config={tableConfig}
                data={results || []}
                loading={loading}
            />
            <Route path={path + "/:loadNumber"} exact component={LoadDetails}/>
            <Route path={path + "/:loadNumber/bid"} component={Form}/>
        </div>
    );
};

export default withRouter(OpenBoard);
