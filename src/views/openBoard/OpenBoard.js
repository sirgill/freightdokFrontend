import React, {Fragment, useEffect, useState} from "react";
import moment from "moment";
import {Button, Stack} from "@mui/material";
import {Route, useHistory, useRouteMatch} from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import LoadDetails from "./LoadDetails";
import {bookNow, getBiddings, getNewTrulLoads} from "../../actions/openBoard.action";
import Form from "./Form";
import {withRouter} from "react-router-dom/cjs/react-router-dom.min";
import {useDispatch, useSelector} from "react-redux";
import {developmentPayload, getParsedLoadEquipment, productionPayload} from "./constants";
import BookNowForm from "./BookNowForm";
import {addEvent, removeEvent} from "../../utils/utils";
import Filters from "./Filters";

let payload = developmentPayload;

if (process.env.NODE_ENV === "production") {
    payload = productionPayload;
}

/*
* {
  "loadNumber": 397704004,
  "carrierCode": "T2244688",
  "emptyDateTime": "2022-05-24T16:43:18.574Z",
  "emptyLocation": {
    "city": "Indianapolis",
    "state": "IN",
    "country": "US",
    "zip": "46143"
  },
  "availableLoadCosts": [
    {
                    "type": "Flat",
                    "code": "400",
                    "description": "Line Haul",
                    "sourceCostPerUnit": 960,
                    "units": 1,
                    "currencyCode": "USD"
    }
  ],
  "rateConfirmation":{
    "email": "Joshua.Hull@chrobinson.com",
    "name": "Joshua Hull"
  }
}
* */

const CARRIER_CODE = "T2244688";
const NEWTRUL = 'newTrul'
const CHROBINSON = 'chRobinson'

const OpenBoard = () => {
    const {path} = useRouteMatch(),
        [filters, setFilters] = useState(payload),
        [vendor, setVendor] = useState(CHROBINSON),
        dispatch = useDispatch(),
        {data: {results, totalResults} = {}, loading = false} = useSelector((state) => state.openBoard),
        history = useHistory();
    console.log(totalResults)

    const getBiddingList = () => {
        if(vendor === NEWTRUL) {
            getNewTrulList(filters.pageSize, filters.pageIndex)
        }
        else dispatch(getBiddings(filters));
    }

    const getNewTrulList = (pageSize, pageIndex) => {
        dispatch(getNewTrulLoads(pageSize, pageIndex))
    }

    const onFilterChange = (fromDate, toDate, type) => {
        if (fromDate === 'select') {
            return setVendor(toDate.target.value)
        }
        const min = moment(fromDate).format('YYYY-MM-DD')
        const max = moment(toDate).format('YYYY-MM-DD')
        const availableForPickUpByDateRange = {
            min,
            max
        }
        setFilters({...filters, availableForPickUpByDateRange})
    }

    useEffect(() => {
        getBiddingList();
        addEvent(window, 'getBiddings', getBiddingList);

        return () => removeEvent(window, 'getBiddings', getBiddingList);
    }, [dispatch, filters]);

    useEffect(() => {
        if (vendor === 'newTrul') {
            const {pageSize, pageIndex} = filters;
            getNewTrulList(pageSize, pageIndex)
        } else getBiddingList()
    }, [vendor])

    const onPageChange = (e, pgNum) => {
        setFilters({...filters, pageIndex: pgNum - 1});
    };

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
                    if (vendor === NEWTRUL) {
                        return <Fragment>{row.id}</Fragment>
                    }
                    return <Fragment>{row.loadNumber}</Fragment>;
                },
            },
            {
                id: "country",
                label: "Pickup City/State",
                renderer: ({row}) => {
                    if (vendor === NEWTRUL) {
                        const [pickup] = row.stops || [],
                            {geo} = pickup || {},
                            {city = '', state = ''} = geo || {};
                        return <Fragment>
                            {city}, {state}
                        </Fragment>
                    } else return (
                        <Fragment>
                            {row?.origin?.city}, {row?.origin?.stateCode}
                        </Fragment>
                    );
                },
            },
            {
                id: "pickupDate",
                label: "Pickup Date",
                renderer: ({row}) => {
                    let date = "";
                    if (vendor === NEWTRUL) {
                        const [pickup] = row.stops || [{}];
                        const {early_datetime = ''} = pickup || {}
                        date = early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';
                    } else if (moment(row?.pickUpByDate).isValid()) {
                        date = moment(row.pickUpByDate).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "deliveryCountry",
                label: "Delivery City/State",
                renderer: ({row = {}}) => {
                    if (vendor === NEWTRUL) {
                        const [_, drop] = row.stops || [],
                            {geo} = drop || {},
                            {city = '', state = ''} = geo || {};
                        return <Fragment>
                            {city}, {state}
                        </Fragment>
                    } else return (
                        <Fragment>
                            {row?.destination?.city}, {row?.destination?.stateCode}
                        </Fragment>
                    );
                },
            },
            {
                id: "deliveryDate",
                label: "Delivery Date",
                renderer: ({row}) => {
                    let date = "";
                    if (vendor === NEWTRUL) {
                        const [_, drop] = row.stops || [],
                            {early_datetime} = drop || {};
                        return early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';
                    }
                    if (moment(row.deliverBy).isValid()) {
                        date = moment(row?.deliverBy).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "equipment",
                label: "Equipment",
                renderer: ({row}) => {
                    if (vendor === NEWTRUL) {
                        const {equipment} = row
                        if (typeof equipment === 'string')
                            return <Fragment>
                                {equipment}
                            </Fragment>;
                        else return null;
                    }
                    const {modesString = '', standard = ''} = getParsedLoadEquipment(row || {})
                    return (
                        <Fragment>
                            {modesString} {standard}
                        </Fragment>
                    );
                },
            },
            {
                id: "weight",
                label: "Weight",
                renderer: ({row}) => {
                    if (vendor === NEWTRUL) {
                        const {weight} = row || {};
                        if (typeof weight === "number")
                            return <Fragment>
                                {weight} lbs
                            </Fragment>
                        else return null;
                    } else {
                        let {weight: {pounds = ""} = {}} = row || {};
                        if (pounds) pounds = pounds + " lbs";
                        return <Fragment>{pounds}</Fragment>;
                    }
                },
            },
            {
                id: "company",
                label: "Company",
                renderer: ({row}) => {
                    if (vendor === NEWTRUL) {
                        return 'New Trul'
                    }
                    return <Fragment>{"C.H Robinson"}</Fragment>;
                },
            },
            {
                id: "bookNow",
                label: "Book Now",
                renderer: ({row = {}}) => {
                    if(vendor === NEWTRUL) {
                        const {book_now_price} = row;
                        if (book_now_price) {
                            return (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        history.push(path + `/${row.id}/bookNow`, row)
                                    }}
                                >
                                    $ {book_now_price}
                                </Button>
                            );
                        }
                        else return null;
                    }
                    if (row.hasOwnProperty("availableLoadCosts")) {
                        const {availableLoadCosts = []} = row || {};
                        const [item] = availableLoadCosts || [];
                        if (item) {
                            return (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        history.push(path + `/${row.loadNumber}/bookNow`, row)
                                    }}
                                >
                                    $ {item?.sourceCostPerUnit}
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
        <Stack style={{gap: '10px'}}>
            <Filters
                onChange={onFilterChange}
                label1={'Minimum pickup Date'}
                label2={'Maximum pickup Date'}
                onRefresh={getBiddingList}
                dateLabel={'Filter by '}
                loading={loading}
                vendor={vendor}
            />
            <EnhancedTable
                config={tableConfig}
                data={results || []}
                loading={loading}
            />
            <Route path={path + "/:loadNumber"} exact component={LoadDetails}/>
            <Route path={path + "/:loadNumber/bid"} component={Form}/>
            <Route path={path + "/:loadNumber/bookNow"} component={BookNowForm}/>
        </Stack>
    );
};

export default withRouter(OpenBoard);
