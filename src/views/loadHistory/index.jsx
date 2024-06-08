import React from "react";
import EnhancedTable from "../../components/Atoms/table/Table";
import useFetchWithSearchPagination from "../../hooks/useFetchWithSearchPagination";
import {Close} from "@mui/icons-material";
import moment from "moment";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {getDollarPrefixedPrice} from "../../utils/utils";
import {Input} from "../../components/Atoms";
import {Link, Route} from "react-router-dom";
import ReplayIcon from "@mui/icons-material/Replay";
import MoveToMyLoads from "../../components/invoices/MoveToMyLoads";
import {UserSettings} from "../../components/Atoms/client";
import LoadHistoryDetail from "./LoadHistoryDetail";

const LoadHistory = (props) => {
    const {edit} = UserSettings.getUserPermissionsByDashboardId('history');
    const {match: {path} = {}} = props
    const {data, loading, limit, page, isPaginationLoading, refetch, isRefetching, onPageChange,
        onLimitChange, isSearching, searchQuery, handleSearch} = useFetchWithSearchPagination('/api/loadHistory')
    const {totalCount, data: loads} = data;

    const config = {
        showRefresh: true,
        rowCellPadding: 'normal',
        count: totalCount,
        page,
        limit,
        onPageChange,
        onPageSizeChange: onLimitChange,
        onLimitChange,
        columns: [
            {
                id: 'loadNumber',
                label: 'Load Number',
                renderer: ({row}) => <Typography sx={{textDecoration: 'underline'}} component={Link} to={`${path}/${row._id}`}>{row.loadNumber}</Typography>
            },
            {
                id: 'pickup',
                label: 'PickUp City/State',
                renderer: ({row: {pickup = []} = {}}) => {
                    const [{pickupCity = '', pickupState = ''}] = pickup;
                    return `${pickupCity}, ${pickupState}`;
                }
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
                id: 'dropCity',
                label: 'Drop City/State',
                renderer: ({row: {drop = []} = {}}) => {
                    const [{dropCity = '', dropState = ''}] = drop;
                    return `${dropCity}, ${dropState}`;
                }
            },
            {
                id: 'dropDate',
                label: 'Drop Date',
                renderer: ({row: {drop = []} = {}}) => {
                    const [{dropDate = ''}] = drop;
                    return moment(dropDate).format('MM/DD/YYYY')
                }
            },

            {
                id: 'brokerage',
                label: 'Customer',
                renderer: ({row: {brokerage = ''} = {}}) => {
                    return brokerage;
                }
            },
            {
                id: 'user.firstName',
                label: "Assigned To",
                renderer: ({ row: { user: { name = '', firstName, lastName} = {} } ={} }) => name || `${firstName || '--'} ${lastName || ''}`
            },
            {
                id: "accessorials",
                label: "Accessorials",
                valueFormatter: (value) => (value || []).join(', ')
            },
            {
                id: 'rate',
                label: 'Rate',
                emptyState: '--',
                valueFormatter: (value) => value ? getDollarPrefixedPrice(value) : ''
            },
            {
                id: 'updatedAt',
                label: 'Updated At',
                valueFormatter: (value) => new Date(value).toLocaleString()
            },
            {
                id: '',
                label: 'Move',
                visible: !!edit,
                renderer: ({row}) => {
                    return <IconButton
                        component={Link}
                        to={path + '/move/' + row._id}
                        variant="outlined"
                        color="primary"
                    >
                        <ReplayIcon/>
                    </IconButton>
                }
            },
        ]
    }

    function getLoadStatuses(loadStatuses=[]) {
        return loadStatuses.map(status => {
            if(status.id.equalsIgnoreCase('archived')){
                return {...status, disabled: true}
            }
            return status;
        });
    }

    const actions = <Stack direction='row'>
        <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder='Search'
            sx={{
                '& .MuiOutlinedInput-root': {
                    pr: 0
                }
            }}
            autoFocus
            InputProps={{
                endAdornment: <IconButton onClick={() => handleSearch({value: ''})} sx={{visibility: searchQuery ? 'visible' : 'hidden'}}>
                    <Close fontSize='small' />
                </IconButton>
            }}
        />
    </Stack>

    const modalConfig = {
        title: 'Move Load'
    }

    return <Box sx={{height: 'inherit'}}>
        <EnhancedTable
            data={loads}
            config={config}
            loading={loading}
            actions={actions}
            onRefetch={refetch}
            isRefetching={isRefetching}
            isPaginationLoading={isPaginationLoading || isSearching}
        />
        <Route
            path={path + '/move/:id'}
            render={(props) => <MoveToMyLoads onCloseUrl={path} refetch={refetch} getLoadStatuses={getLoadStatuses} modalConfig={modalConfig} {...props} />}/>
        <Route path={path + '/:id'} component={LoadHistoryDetail} />
    </Box>
}

export default LoadHistory;