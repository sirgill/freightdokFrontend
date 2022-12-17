import React, {Fragment, useEffect, useState} from "react";
import EnhancedTable from "../../components/Atoms/table/Table"
import {getAllBiddings} from "../../actions/openBoard.action";
import {Button} from "@mui/material";
import {useRouteMatch, useHistory} from "react-router"
import moment from "moment";
import {Route, Switch} from "react-router-dom";
import CHRobinsonBid from "./bids/CHRobinsonBid";


const getBidStatus = (bidLevel) => {
    if (bidLevel === 2) {
        return "Counter"
    } else if (bidLevel === 1) {
        return "Pending"
    } else {
        return "Final Offer"
    }
}


const MyBids = ({}) => {
    const {path} = useRouteMatch()
    const history = useHistory()
    const [myBids, setMyBids] = React.useState([]);
    const [loading, setloading] = useState(false)

    useEffect(() => {
        setloading(true)
        getAllBiddings().then(res => {
            setMyBids(res.data)
        })
            .finally(() => setloading(false))
    }, [])



    const tableConfig = {
        rowCellPadding: "inherit",
        emptyMessage: "No Bids Found",
        // onRowClick: ({ loadNumber, id }) => vendor.toLowerCase() === 'newtrul' ? `${path}/newtrul/${id}` : `${path}/${loadNumber}`,
        count: myBids.length,
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
                    const [pickup] = row?.loadDetail?.stops || [],
                        {geo} = pickup || {},
                        {city = '', state = ''} = geo || {};
                    if (!city && !state) return '--'
                    return <Fragment>
                        {city}, {state}
                    </Fragment>
                },
            },
            {
                id: "loadNumber",
                label: "PickUp Date",
                renderer: ({row}) => {
                    let date;
                    const [pickup] = row?.loadDetail?.stops || [{}];
                    const {early_datetime = ''} = pickup || {}
                    date = early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';

                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "loadNumber",
                label: "Delivery City / State",
                renderer: ({row: {rowDetail = {}} = {}}) => {
                    const [_, drop] = rowDetail.stops || [],
                        {geo} = drop || {},
                        {city = '', state = ''} = geo || {};
                    if (!city && !state) return '--'
                    return <Fragment>
                        {city}, {state}
                    </Fragment>
                }
            },
            {
                id: "loadNumber",
                label: "Delivery Date",
                renderer: ({row}) => {
                    const [_, drop] = row?.loadDetail?.stops || [],
                        {early_datetime} = drop || {};
                    return early_datetime ? moment(early_datetime).format("M/DD/YYYY") : '--';

                },
            },
            {
                id: "loadNumber",
                label: "Equipment",
                renderer: ({row}) => {
                    const {equipment} = row.loadDetail || {}
                    if (typeof equipment === 'string')
                        return <Fragment>
                            {equipment}
                        </Fragment>;
                    else return '--';
                }
            },
            {
                id: "loadNumber",
                label: "Weight",
                renderer: ({row}) => {
                    const {weight} = row.loadDetail || {};
                    if (typeof weight === "number")
                        return <Fragment>
                            {weight} lbs
                        </Fragment>
                    else return '--';

                },
            },
            {
                id: "vendorName",
                label: "Company",
            },
            {
                id: "status",
                label: "Bid Status",
                renderer: ({row}) => {
                    return (
                        <Fragment>
                            {row.status ? "Accepted" : getBidStatus(row.bidLevel)}
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
                    if(vendorName.toLowerCase() === 'ch robinson'){
                        // route = path + `/chrobinson/bid/${row.loadNumber}`;
                    }
                    return (
                        <Fragment>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    history.push(route, {
                                        ...row,
                                    });
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
            <EnhancedTable config={tableConfig} data={myBids} loading={loading}/>
            <Switch>
                <Route path={path+'/bid/:loadNumber'} component={CHRobinsonBid} />
            </Switch>
        </div>
    );
};


export default MyBids;
