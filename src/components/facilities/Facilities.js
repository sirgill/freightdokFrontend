import React from 'react';
import {Link, useRouteMatch, Switch, Route} from 'react-router-dom';
import {Button, IconButton, Stack} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import {Box} from '@mui/material';
import Form from './Form';
import Preview from './Preview';
import {Input} from "../Atoms";
import {ROLES} from "../constants";
import {UserSettings} from "../Atoms/client";
import EnhancedTable from "../../components/Atoms/table/Table"
import {showDelete} from "../../actions/component.action";
import useFetchWithSearchPagination from "../../hooks/useFetchWithSearchPagination";
import {Close} from "@mui/icons-material";


const Facilities = () => {
    const {path} = useRouteMatch();
    const {add, delete: canDelete, edit} = UserSettings.getUserPermissionsByDashboardId('facilities');
    const {data, loading, page, isPaginationLoading, limit, onLimitChange, onPageChange, handleSearch, refetch,
            searchQuery, isSearching, isRefetching} = useFetchWithSearchPagination('/api/warehouse'),
        {totalCount, facilities = []} = data || {};

    const afterDelete = ({success}) => {
        if (success) {
            refetch();
        }
    }

    const config = {
        count: totalCount,
        page,
        limit,
        deletePermissions: ['admin', 'superAdmin'],
        onRowClick: ({_id}) => `${path}/preview/${_id}`,
        rowCellPadding: 'normal',
        showRefresh: true,
        onPageChange: onPageChange,
        onPageSizeChange: onLimitChange,
        columns: [
            {
                id: 'name',
                label: 'Facility'
            },
            {
                id: 'address',
                label: 'Address'
            },
            {
                id: 'city',
                label: 'City'
            },
            {
                id: 'state',
                label: 'State'
            },
            {
                id: 'zip',
                label: 'Zip Date'
            },
            {
                id: 'serviceHours',
                label: 'Service Hours',
            },
            {
                id: 'actions',
                visible: ({role}) => role === ROLES.admin || role === ROLES.superadmin,
                renderer: ({row: {_id, name}}) => {
                    return <Button
                        variant='contained'
                        color='error'
                        disabled={!canDelete}
                        onClick={showDelete({
                            message: 'Are you sure you want to delete Facility ' + name + '?',
                            uri: '/api/warehouse/' + _id,
                            afterSuccessCb: afterDelete,
                        })}
                    >
                        Delete
                    </Button>
                }
            }
        ]
    }

    const Actions = <Stack direction='row' gap={1}>
        <Input
            placeholder='Search by Facility, Address, City, State'
            name='text'
            autoFocus
            onChange={handleSearch}
            value={searchQuery}
            sx={{
                '& .MuiOutlinedInput-root': {
                    pr: 0
                }
            }}
            InputProps={{
                endAdornment: <IconButton onClick={() => handleSearch({value: ''})}>
                    <Close fontSize='small' />
                </IconButton>
            }}
        />
        <Button variant='contained' component={Link} to={path + '/add'} disabled={!add} startIcon={<AddIcon />}>
            Add
        </Button>
    </Stack>

    return (
        <Box sx={{height: 'inherit'}}>
            <EnhancedTable config={config} data={facilities} loading={loading} onRefetch={refetch} isRefetching={isRefetching} actions={Actions}
                           isPaginationLoading={isPaginationLoading || isSearching}
            />
            <Switch>
                <Route render={(props) => <Form {...props} refetch={refetch} />} path={path + '/add'}/>
                <Route render={(props) => <Form {...props} refetch={refetch} />} path={path + '/edit/:id'} refetch={refetch} />
                <Route render={(props) => <Preview {...props} canEdit={!!edit} closeUrl={path}/>} path={path + '/preview/:id'}/>
            </Switch>
        </Box>
    )
}

export default Facilities;