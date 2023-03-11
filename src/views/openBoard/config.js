import { bookNewTrulLoad, getParsedLoadEquipment, NEWTRUL } from "./constants";
import React, { Fragment } from "react";
import moment from "moment";
import {Button, Typography} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

const tableConfig = ({ history, path, totalResults, onPageChange, pageIndex, pageSize, showDialog }) => {
    return {
        rowCellPadding: "normal",
        emptyMessage: "No Shipments Found",
        onRowClick: ({
            loadNumber,
            id,
            vendorName
        }) => vendorName.toLowerCase() === 'newtrul' ? `${path}/newtrul/${id}` : `${path}/${loadNumber}`,
        count: totalResults,
        limit: pageSize,
        page: pageIndex,
        onPageChange,
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
                renderer: ({ row }) => {
                    if (row.vendorName === NEWTRUL) {
                        return <Fragment>{row.id}</Fragment>
                    }
                    return <Fragment>{row.loadNumber}</Fragment>;
                },
            },
            {
                id: "country",
                label: "Pickup City/State",
                renderer: ({ row }) => {
                    if (row.vendorName === NEWTRUL) {
                        // eslint-disable-next-line no-unused-vars
                        const [_, pickup] = row.stops || [],
                            { geo } = pickup || {},
                            { city = '', state = '' } = geo || {};
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
                renderer: ({ row }) => {
                    let date = "";
                    if (row.vendorName === NEWTRUL) {
                        // eslint-disable-next-line no-unused-vars
                        const [_, pickup] = row.stops || [{}];
                        const { early_datetime = '' } = pickup || {}
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
                renderer: ({ row = {} }) => {
                    if (row.vendorName === NEWTRUL) {
                        // eslint-disable-next-line no-unused-vars
                        const [drop, _] = row.stops || [],
                            { geo } = drop || {},
                            { city = '', state = '' } = geo || {};
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
                renderer: ({ row }) => {
                    let date = "";
                    if (row.vendorName === NEWTRUL) {
                        // eslint-disable-next-line no-unused-vars
                        const [drop, _] = row.stops || [],
                            { early_datetime } = drop || {};
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
                renderer: ({ row }) => {
                    if (row.vendorName === NEWTRUL) {
                        const { equipment } = row
                        if (typeof equipment === 'string')
                            return <Fragment>
                                {equipment}
                            </Fragment>;
                        else return null;
                    }
                    const { modesString = '', standard = '' } = getParsedLoadEquipment(row || {})
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
                renderer: ({ row }) => {
                    if (row.vendorName === NEWTRUL) {
                        const { weight } = row || {};
                        if (typeof weight === "number")
                            return <Fragment>
                                {weight} lbs
                            </Fragment>
                        else return null;
                    } else {
                        let { weight: { pounds = "" } = {} } = row || {};
                        if (pounds) pounds = pounds + " lbs";
                        return <Fragment>{pounds}</Fragment>;
                    }
                },
            },
            {
                id: "company",
                label: "Company",
                renderer: ({ row }) => {
                    if (row.vendorName === NEWTRUL) {
                        const { client: { client_name } = {} } = row || {}
                        return client_name || '--'
                    }
                    return <Fragment>{"C.H Robinson"}</Fragment>;
                },
            },
            {
                id: "bookNow",
                label: "Book Now",
                renderer: ({ row = {} }) => {
                    if (row.vendorName === NEWTRUL) {
                        const { book_now_price } = row;
                        if (book_now_price) {
                            const onBookNowNewtrul = (e) => {
                                e.stopPropagation();
                                const dialogProps = {
                                    title: 'Book Now',
                                    maxWidth: 'md',
                                    content: <Typography fontSize={16}>Do you want to Book now at? ${book_now_price}</Typography>,
                                    okButtonText: 'Book',
                                    onOk: (onClose) => {
                                        /*
                                        * {TODO} - payload needs to be adjusted
                                        * */
                                        const payload = {
                                            "external_id": uuidv4(),
                                            "terms_condition": true,
                                            "driver_name": "Driver Namme",
                                            "driver_phone_number": "(123) 456-6789",
                                            "truck_number": "FVS200937",
                                            "trailer_number": "EA5318",
                                            "tracking_url": "https://www.google.com/",
                                            "loadId": row.id
                                        }
                                        bookNewTrulLoad(payload, row, () => onClose())
                                    }
                                }
                                showDialog(dialogProps);
                            }
                            return (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onBookNowNewtrul}
                                >
                                    $ {book_now_price}
                                </Button>
                            );
                        } else return null;
                    }
                    if (row.hasOwnProperty("availableLoadCosts")) {
                        const { availableLoadCosts = [] } = row || {};
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
                renderer: ({ row }) => {
                    return (
                        <Fragment>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (row.vendorName === NEWTRUL) {
                                        return history.push(path + `/${row.id}/bid`, {
                                            ...row,
                                            vendor: row.vendorName,
                                            company: 'New Trul',
                                            price: row.book_now_price
                                        });
                                    }
                                    history.push(path + `/${row.loadNumber}/bid`, {
                                        ...row,
                                        vendor: row.vendorName,
                                        company: row.vendorName === NEWTRUL ? 'New Trul' : 'C.H Robinson'
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
}

export {
    tableConfig
}