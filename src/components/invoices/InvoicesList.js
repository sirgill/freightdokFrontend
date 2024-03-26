import React, { useEffect, Fragment } from 'react';
import {Box, Button} from "@mui/material";
import { resetLoadsSearch } from '../../actions/load.js';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoiceLoads } from "../../actions/load";
import EnhancedTable from "../Atoms/table/Table";
import { Link, Route, useRouteMatch } from "react-router-dom";
import Invoice from "./NewInvoice";
import moment from "moment";
import { getParsedLoadEquipment } from "../../views/openBoard/constants";
import MoveToMyLoads from "./MoveToMyLoads";
import ReplayIcon from '@mui/icons-material/Replay';
import DescriptionIcon from '@mui/icons-material/Description';


export default function InvoicesList({ listBarType }) {
    const dispatch = useDispatch();
    const {path} = useRouteMatch();
    const { role } = useSelector(state => state.auth?.user) || {};
    const {data = [], page, limit, loading} = useSelector(state => state.load.invoices);
    const loads = useSelector(state => state.load.loads);

    useEffect(() => {
        dispatch(resetLoadsSearch(listBarType));
        getInvoices();
        // dispatch(getCHLoads(true));
        return () => {
            dispatch(resetLoadsSearch(listBarType));
        }
    }, []);

    const getInvoices = () => {
        dispatch(getInvoiceLoads());
    }

    useEffect(() => {
        getInvoices();
    }, [loads]);

    const config = {
        rowCellPadding: "normal",
        headerCellSx: { pt: 1, pb: 1 },
        emptyMessage: 'No Invoices found',
        showRefresh:true,
        page,
        limit,
        columns: [
            {
                id: 'loadNumber',
                label: 'Load Number',
            },
            {
                id: "country",
                label: "Pickup City/State",
                renderer: ({ row }) => {
                    return (
                        <Fragment>
                            {row.pickup[0].pickupCity}, {row.pickup[0].pickupState}
                        </Fragment>
                    );
                },
            },
            {
                id: "pickupDate",
                label: "Pickup Date",
                renderer: ({ row }) => {
                    let date = "";
                    if (moment(row.pickUpByDate).isValid()) {
                        date = moment(row.pickUpByDate).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "deliveryCountry",
                label: "Delivery City/State",
                renderer: ({ row }) => {
                    return (
                        <Fragment>
                            {row.drop[0].dropCity}, {row.drop[0].dropState}
                        </Fragment>
                    );
                },
            },
            {
                id: "deliveryDate",
                label: "Delivery Date",
                renderer: ({ row }) => {
                    let date = "";
                    if (moment(row.deliverBy).isValid()) {
                        date = moment(row.deliverBy).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "equipment",
                label: "Equipment",
                renderer: ({ row }) => {
                    const { modesString = '', standard = '' } = getParsedLoadEquipment(row) || {}
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
                    let { weight: { pounds = "" } = {} } = row || {};
                    if (pounds) pounds = pounds + " lbs";
                    return <Fragment>{pounds}</Fragment>;
                },
            },
            {
                id: "company",
                label: "Company",
                renderer: ({ row }) => {
                    return row?.brokerage
                },
                emptyState: '--'
            },
            {
                id: 'rate',
                label: 'Rate',
                emptyState: '--'
            },
            {
                id: '',
                label: 'Invoice',
                visible: ['driver', 'admin', 'superAdmin', 'ownerOperator'].includes(role),
                renderer: ({ row }) => {
                    return <Button
                        component={Link}
                        to={path + '/' + row._id}
                        variant="outlined"
                        color="primary"
                        startIcon={<DescriptionIcon />}
                    >
                        Create Invoice
                    </Button>
                }
            },
            {
                id: '',
                label: 'Move',
                visible: ['driver', 'admin', 'superAdmin', 'ownerOperator'].includes(role),
                renderer: ({ row }) => {
                    return <Button
                        component={Link}
                        to={path + '/moveToMyLoads/' + row._id}
                        variant="outlined"
                        color="primary"
                        startIcon={<ReplayIcon />}
                    >
                        My loads
                    </Button>
                }
            },
        ]
    }

    return (
        <Box sx={{mt: 3}}>
            <Fragment>
                <EnhancedTable config={config} data={data} loading={loading} onRefetch={getInvoices} />
                <Route path={path + '/moveToMyLoads/:id'} render={(props) => <MoveToMyLoads onCloseUrl={path} getInvoices={getInvoices} {...props} />} />
                <Route path={path + '/:id'} exact component={Invoice} onCloseUrl={path} />
            </Fragment>
        </Box>
    )
}