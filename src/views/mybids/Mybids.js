import React, { Fragment, useEffect, useState } from "react";
import moment from 'moment';
import { connect, useDispatch, useSelector } from "react-redux";
import { deleteLoad, getLoads, searchLoads, selectLoad } from "../../actions/load";
import EnhancedTable from "../../components/Atoms/table/Table"
import { getAllBiddings } from "../../actions/openBoard.action";
import { Button } from "@mui/material";
import { useRouteMatch, useHistory } from "react-router"


const getBidStatus = (bidLevel) => {
    if (bidLevel === 2) {
        return "Counter"
    } else if (bidLevel === 1) {
        return "Pending"
    }
    else {
        return "Final Offer"
    }
}


const MyBids = ({
}) => {
    const dispatch = useDispatch()
    const { path } = useRouteMatch()
    const history = useHistory()
    const [myBids, setMyBids] = React.useState([]);
    useEffect(() => {
        getAllBiddings().then(res => {
            setMyBids(res.data)
        })
    }, [])



    const tableConfig = {
        rowCellPadding: "inherit",
        emptyMessage: "No Bids Found",
        // onRowClick: ({ loadNumber, id }) => vendor.toLowerCase() === 'newtrul' ? `${path}/newtrul/${id}` : `${path}/${loadNumber}`,
        count: myBids.length,
        rowStyleCb: ({ row }) => {
            const { bidLevel, status } = row;
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
            },
            {
                id: "loadNumber",
                label: "PickUp Date",
            },
            {
                id: "loadNumber",
                label: "Delivery City / State",
            },
            {
                id: "loadNumber",
                label: "Delivery Date",
            },
            {
                id: "loadNumber",
                label: "Equipment",
            },
            {
                id: "loadNumber",
                label: "Weight",
            },
            {
                id: "vendorName",
                label: "Company",
            },
            {
                id: "status",
                label: "Bid Status",
                renderer: ({ row }) => {
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
                renderer: ({ row }) => {
                    return (
                        <Fragment>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    history.push(path + `/${row.loadNumber}/bid`, {
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
            <EnhancedTable config={tableConfig} data={myBids} loading={false} />

        </div>
    );
};




export default MyBids;
