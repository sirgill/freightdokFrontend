import React, {Fragment} from 'react';
import {Box, Button, IconButton} from "@mui/material";
import {Link, Route, useRouteMatch} from "react-router-dom";
import DescriptionIcon from '@mui/icons-material/Description';
import Invoice from "./NewInvoice";
import moment from "moment";
import EnhancedTable from "../Atoms/table/Table";
import ReplayIcon from '@mui/icons-material/Replay';
import MoveToMyLoads from "./MoveToMyLoads";
import {UserSettings} from "../Atoms/client";
import {getDollarPrefixedPrice} from "../../utils/utils";
import useFetchWithSearchPagination from "../../hooks/useFetchWithSearchPagination";

const modalConfig = {
    title: 'Move invoice'
}
export default function InvoicesList() {
    const {edit = false} = UserSettings.getUserPermissionsByDashboardId('invoices') || {};
    const {path} = useRouteMatch();
    const {
            data: _data, loading, page, limit, onPageChange, onLimitChange, refetch,
            isPaginationLoading, isRefetching
        } = useFetchWithSearchPagination('/api/load/invoice_loads'),
        {loads, total} = _data || {};


    const config = {
        rowCellPadding: "normal",
        headerCellSx: {pt: 1, pb: 1},
        emptyMessage: 'No Invoices found',
        showRefresh: true,
        page,
        limit,
        count: total,
        onPageChange,
        onPageSizeChange: onLimitChange,
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
                id: "assigned",
                label: "Assigned To",
                renderer: ({row}) => {
                    const {user = {}} = {} = row || {},
                        {name = '', firstName, lastName} = user || {};
                    return name || `${firstName || '--'} ${lastName || ''}`
                }
            },
            {
                id: "accessorials",
                label: "Accessorials",
                valueFormatter: (value) => (value || []).join(', ')
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
                    return <IconButton
                        component={Link}
                        to={path + '/moveToMyLoads/' + row._id}
                        variant="outlined"
                        color="primary"
                    >
                        <ReplayIcon/>
                    </IconButton>
                }
            },
        ]
    }

    return (
        <Box sx={{height: 'inherit'}}>
            <Fragment>
                <EnhancedTable config={config} data={loads} loading={loading} onRefetch={refetch}
                               isRefetching={isRefetching}
                               isPaginationLoading={isPaginationLoading}
                />
                {edit && <Route path={path + '/moveToMyLoads/:id'}
                                render={(props) => <MoveToMyLoads onCloseUrl={path}
                                                                  getInvoices={refetch}
                                                                  modalConfig={modalConfig} {...props} />}/>}
                {edit && <Route path={path + '/:id'} exact component={Invoice} onCloseUrl={path}/>}
            </Fragment>
        </Box>
    )
}