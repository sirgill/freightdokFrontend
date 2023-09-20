import React, {Fragment, useEffect} from "react";
import EnhancedTable from "../../components/Atoms/table/Table"
import {Button} from "@mui/material";
import {useHistory, useRouteMatch} from "react-router"
import moment from "moment";
import {Route, Switch} from "react-router-dom";
import CHRobinsonBid from "./bids/BidDetail";
import NewTrulLoadDetails from "../openBoard/NewTrulLoadDetails";
import prepareBidDataForNewTrul from "./bids/constant";
import useFetch from "../../hooks/useFetch";
import {getParsedLoadEquipment} from "../openBoard/constants";

const getBidStatus = (bidLevel) => {
    if (bidLevel === 2) {
        return "Counter"
    } else if (bidLevel === 1) {
        return "Pending"
    } else {
        return "Final Offer"
    }
}


const MyBids = () => {
    const {path} = useRouteMatch()
    const history = useHistory()
    const {data = {}, loading: dLoading, refetch} = useFetch('/api/bid/biddings'),
        {data: bidsData = [], totalCount = 0} = data || {};

    useEffect(() => {
        //Poll mybids api
        const bidIntervals = setInterval(() => {
            refetch();
        }, 5000);

        return () => clearInterval(bidIntervals);
    }, [])


    const tableConfig = {
        rowCellPadding: "normal",
        emptyMessage: "No Bids Found",
        showRefresh: true,
        onRowClick: ({
                         loadNumber,
                         id,
                         vendorName = ''
                     }) => vendorName.toLowerCase() === 'new trul' ? `${path}/newtrul/${loadNumber}` : `${path}/${loadNumber}`,
        onRowClickDataCallback: (row) => row.loadDetail || {},
        count: totalCount,
        rowStyleCb: ({row}) => {
            const {bidLevel, status} = row;
            //to show rejected, bidlevel:1 and status false
            //to show counter offer bid level: 2, status: false
            if (bidLevel === 2) {
                return {
                    borderLeft: '5px solid #ffeaa7'
                }
            } else if (bidLevel === 1) {
                return {
                    borderLeft: !status ? `5px solid #e74c3c` : '5px solid #00b894'
                }
            }
        },
        columns: [
            {
                id: "loadNumber",
                label: "Load Number",
            },
            {
                id: "pickup",
                label: "Pickup City/State",
                renderer: ({row}) => {
                    const {loadDetail = {}} = row;
                    if(row.vendorName?.toLowerCase() === 'c.h. robinson'){
                        return `${loadDetail?.origin?.city}, ${loadDetail?.origin?.stateCode}`
                    }
                    const [_, pickup] = row?.loadDetail?.stops || [],
                        {geo} = pickup || {},
                        {city = '', state = ''} = geo || {};
                    if (!city && !state) return '--'
                    return <Fragment>
                        {city}, {state}
                    </Fragment>
                },
            },
            {
                id: "",
                label: "PickUp Date",
                renderer: ({row}) => {
                    let date;
                    const [_, pickup] = row?.loadDetail?.stops || [{}];
                    if(row.vendorName === 'C.H. Robinson'){
                        return moment(row.loadDetail.pickUpByDate).format("M/DD/YYYY")
                    }
                    else if (pickup) {
                        const {early_datetime = ''} = pickup || {}
                        return early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';
                    }
                    const {early_datetime = ''} = pickup || {}
                    date = early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';

                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "",
                label: "Delivery City / State",
                renderer: ({row = {}}) => {
                    const {loadDetail = {}} = row;
                    if(row.vendorName?.toLowerCase() === 'c.h. robinson'){
                        return `${loadDetail?.destination?.city}, ${loadDetail?.destination?.stateCode}`
                    }
                    const [drop] = loadDetail.stops || [],
                        {geo} = drop || {},
                        {city = '', state = ''} = geo || {};
                    if (!city && !state) return '--'
                    return <Fragment>
                        {city}, {state}
                    </Fragment>
                }
            },
            {
                id: "deliveryDate",
                label: "Delivery Date",
                renderer: ({row}) => {
                    if(row.loadDetail?.deliverBy){
                        return moment(row.loadDetail?.deliverBy).format("M/DD/YYYY")
                    }
                    const [drop, _] = row?.loadDetail?.stops || [],
                        {early_datetime} = drop || {};
                    return early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';

                },
            },
            {
                id: "equipment",
                label: "Equipment",
                renderer: ({row}) => {
                    const {equipment, vendorName = ''} = row.loadDetail || {}
                    if(vendorName.toLowerCase()==='chrobinson'){
                        const {modesString = '', standard = ''} = getParsedLoadEquipment(row.loadDetail || {})
                        return (
                            <Fragment>
                                {modesString} {standard}
                            </Fragment>
                        );
                    }
                    if (typeof equipment === 'string')
                        return <Fragment>
                            {equipment}
                        </Fragment>;
                    else return '--';
                }
            },
            {
                id: "",
                label: "Weight",
                renderer: ({row}) => {
                    const {weight} = row.loadDetail || {};
                    if (typeof weight === "number")
                        return <Fragment>
                            {weight} lbs
                        </Fragment>
                        else if(weight?.pounds){
                        let {weight: {pounds = ""} = {}} = row.loadDetail || {};
                        if (pounds) pounds = pounds + " lbs";
                        return pounds
                    }
                    else return '--';

                },
            },
            {
                id: "vendorName",
                label: "Company",
                renderer: ({row}) => {
                    const {loadDetail: {client = {}} = {}} = row;
                    if (client.client_name) {
                        return client.client_name
                    }
                    return row['vendorName'] || '';
                }
            },
            {
                id: "status",
                label: "Bid Status",
                renderer: ({row}) => {
                    const {offerStatus = ''} = prepareBidDataForNewTrul(row) || {},
                        isRejected = offerStatus.toLowerCase().includes('rejected');

                    if(row.vendorName === "C.H. Robinson" && row.offerStatus){
                        return row.offerStatus;
                    }
                    return (
                        <Fragment>
                            {row.status ? "Accepted" : isRejected ? 'Rejected' : getBidStatus(row.bidLevel)}
                        </Fragment>
                    );
                },
            },
            {
                id: "Bidding",
                label: "Bid",
                renderer: ({row}) => {
                    const {vendorName = ''} = row || {}
                    let route = path + `/bid/${row.loadNumber}`;
                    const {offerStatus = ''} = prepareBidDataForNewTrul(row) || {},
                        isCounterOffer = offerStatus.equalsIgnoreCase("COUNTER_OFFER_CREATED"),
                        isFinalOffer = offerStatus.equalsIgnoreCase('final_offer_created'),
                        isRejected = offerStatus.toLowerCase().includes('rejected');
                    if (vendorName.toLowerCase() === 'ch robinson') {
                        // route = path + `/chrobinson/bid/${row.loadNumber}`;
                    }
                    return (
                        <Fragment>
                            {!isRejected && <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    history.push(route, {
                                        ...row,
                                    });
                                }}
                            >
                                View
                            </Button>}
                        </Fragment>
                    );
                },
            },
        ],
    };

    return (
        <div>
            <EnhancedTable config={tableConfig} data={bidsData} loading={dLoading} onRefetch={refetch}/>
            <Switch>
                <Route
                    path={path + '/bid/:loadNumber'}
                    render={(props) => <CHRobinsonBid {...props} onCloseUrl={path} onRefresh={refetch} />}
                />
                <Route path={path + "/newtrul/:loadId"}
                       render={(props) => <NewTrulLoadDetails {...props} callDetail={false}/>}/>
            </Switch>
        </div>
    );
};


export default MyBids;
