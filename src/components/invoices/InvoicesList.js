import React, {Fragment, useState} from 'react';
import {Box, Stack, IconButton} from "@mui/material";
import {Link, Route, useRouteMatch} from "react-router-dom";
import {PictureAsPdf} from "@mui/icons-material";
import DescriptionIcon from '@mui/icons-material/Description';
import Invoice from "./NewInvoice";
import moment from "moment";
import EnhancedTable from "../Atoms/table/Table";
import ReplayIcon from '@mui/icons-material/Replay';
import MoveToMyLoads from "./MoveToMyLoads";
import {UserSettings} from "../Atoms/client";
import {getDollarPrefixedPrice} from "../../utils/utils";
import useFetchWithSearchPagination from "../../hooks/useFetchWithSearchPagination";
import Tooltip from "../Atoms/Tooltip";
import useMutation from "../../hooks/useMutation";
import {LoadingButton} from "../Atoms";
import {notification} from "../../actions/alert";

const modalConfig = {
    title: 'Move invoice'
}
export default function InvoicesList() {
    const {edit = false, canSendToTriumph} = UserSettings.getUserPermissionsByDashboardId('invoices') || {};
    const {path} = useRouteMatch();
    const {mutation, loading: isLoadingPdf} = useMutation('/create-be-invoice-pdf', null, true)
    const {
            data: _data, loading, page, limit, onPageChange, onLimitChange, refetch,
            isPaginationLoading, isRefetching
        } = useFetchWithSearchPagination('/api/load/invoice_loads'),
        [checkboxes, setCheckboxes] = useState([]),
        {loads, total} = _data || {};

    const config = {
        rowCellPadding: "normal",
        headerCellSx: {pt: 1, pb: 1},
        emptyMessage: 'No Invoices found',
        showRefresh: true,
        page,
        limit,
        count: total,
        onPageChange: (...args) => {
            onPageChange(...args);
            resetCheckboxes();
        },
        onLimitChange: (...args) => {
            onLimitChange(...args);
            resetCheckboxes();
        },
        showCheckbox: !!canSendToTriumph,
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
                id: 'updatedAt',
                label: 'Updated On',
                valueFormatter: (value) => new Date(value).toLocaleString()
            },
            {
                id: '',
                label: 'Invoice',
                visible: !!edit,
                renderer: ({row}) => {
                    return <Stack direction={'row'}>
                        <Tooltip title='Create Invoice' placement='top'>
                            <IconButton
                                component={Link}
                                to={path + '/' + row._id}
                                variant="outlined"
                                color="primary"
                            >
                                <DescriptionIcon/>
                            </IconButton>
                        </Tooltip>
                        {row.invoiceUrl && <Tooltip title='Server Invoice' placement='top'>
                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open(row.invoiceUrl, '_blank')
                                }}
                                variant="outlined"
                                color="primary"
                            >
                                <PictureAsPdf sx={{color: 'red'}}/>
                            </IconButton>
                        </Tooltip>}
                    </Stack>
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

    const onCheckboxChange = (row, e) => {
        e.preventDefault();
        const key = row['loadNumber'];
        const index = checkboxes.indexOf(key);
        let newCheckboxes = [...checkboxes]
        if(index > -1) {
            newCheckboxes = newCheckboxes.toSpliced(index, 1)
        } else {
            newCheckboxes.push(key);
        }
        setCheckboxes(newCheckboxes);
    }

    const onRefresh = () => {
        refetch();
        resetCheckboxes();
    }

    const resetCheckboxes = () => setCheckboxes([])

    const onSendToTriumph = () => {
        mutation({loadIds: checkboxes}, null, ({success, data}) => {
              if(data.data.length){
                data.data.forEach((invoice, index) => {
                    setTimeout(() => {
                        notification(invoice.message, invoice.invoiceCreated ? 'success' : 'error');
                    }, index * 2000);
                });
              }
            if(success) {
                resetCheckboxes();
                refetch();
            }
        })
    }

    const actions = <Box>
        {canSendToTriumph && <LoadingButton
            variant='contained'
            disabled={!checkboxes.length}
            isLoading={isLoadingPdf}
            loadingText='Please Wait...'
            onClick={onSendToTriumph}
        >
            Upload on Triumph
        </LoadingButton>}
    </Box>

    return (
        <Box sx={{height: 'inherit'}} className='dashboardRoot'>
            <Fragment>
                <EnhancedTable
                    config={config}
                    data={loads}
                    loading={loading}
                    onRefetch={onRefresh}
                    isRefetching={isRefetching}
                    isPaginationLoading={isPaginationLoading}
                    onCheckboxChange={onCheckboxChange}
                    checkboxes={checkboxes}
                    checkboxKey={'loadNumber'}
                    actions={actions}
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