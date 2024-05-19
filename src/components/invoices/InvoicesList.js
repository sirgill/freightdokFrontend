import React, {useEffect, Fragment} from 'react';
import {Box, Button} from "@mui/material";
import {resetLoadsSearch} from '../../actions/load.js';
import {useDispatch, useSelector} from 'react-redux';
import {getInvoiceLoads} from "../../actions/load";
import {Link, Route, useRouteMatch} from "react-router-dom";
import DescriptionIcon from '@mui/icons-material/Description';
import Invoice from "./NewInvoice";
import moment from "moment";
import EnhancedTable from "../Atoms/table/Table";
import ReplayIcon from '@mui/icons-material/Replay';
import {getParsedLoadEquipment} from "../../views/openBoard/constants";
import MoveToMyLoads from "./MoveToMyLoads";
import {UserSettings} from "../Atoms/client";
import {getDollarPrefixedPrice} from "../../utils/utils";


export default function InvoicesList({listBarType}) {
    const {edit = false} = UserSettings.getUserPermissionsByDashboardId('invoices') || {};
    const dispatch = useDispatch();
    const {path} = useRouteMatch();
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
        headerCellSx: {pt: 1, pb: 1},
        emptyMessage: 'No Invoices found',
        showRefresh: true,
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
                renderer: ({row}) => {
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
                renderer: ({row: {pickup = []} = {}}) => {
                    const [{pickupDate = ''}] = pickup;
                    return moment(pickupDate).format('MM/DD/YYYY')
                }
            },
            {
                id: "deliveryCountry",
                label: "Delivery City/State",
                renderer: ({row}) => {
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
                renderer: ({row: {drop = []} = {}}) => {
                    const [{dropDate = ''}] = drop;
                    return moment(dropDate).format('MM/DD/YYYY')
                }
            },
            {
                id: "equipment",
                label: "Equipment",
                renderer: ({row}) => {
                    const {modesString = '', standard = ''} = getParsedLoadEquipment(row) || {}
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
                    let {weight: {pounds = ""} = {}} = row || {};
                    if (pounds) pounds = pounds + " lbs";
                    return <Fragment>{pounds}</Fragment>;
                },
            },
            {
                id: "company",
                label: "Company",
                renderer: ({row}) => {
                    return row?.brokerage
                },
                emptyState: '--'
            },
            {
                id: 'rate',
                label: 'Rate',
                emptyState: '--',
                valueFormatter: (value) => value ? getDollarPrefixedPrice(value) : ''
            },
            {
                id: '',
                label: 'Invoice',
                visible: !!edit,
                renderer: ({row}) => {
                    return <Button
                        component={Link}
                        to={path + '/' + row._id}
                        variant="outlined"
                        color="primary"
                        startIcon={<DescriptionIcon/>}
                    >
                        Create Invoice
                    </Button>
                }
            },
            {
                id: '',
                label: 'Move',
                visible: !!edit,
                renderer: ({row}) => {
                    return <Button
                        component={Link}
                        to={path + '/moveToMyLoads/' + row._id}
                        variant="outlined"
                        color="primary"
                        startIcon={<ReplayIcon/>}
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
                <EnhancedTable config={config} data={data} loading={loading} onRefetch={getInvoices}/>
                {edit && <Route path={path + '/moveToMyLoads/:id'}
                                render={(props) => <MoveToMyLoads onCloseUrl={path}
                                                                  getInvoices={getInvoices} {...props} />}/>}
                {edit && <Route path={path + '/:id'} exact component={Invoice} onCloseUrl={path}/>}
            </Fragment>
        </Box>
    )
}