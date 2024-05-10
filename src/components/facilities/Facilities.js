import React from 'react';
import {Link, useRouteMatch, Switch, Route} from 'react-router-dom';
import {Button} from '@mui/material';
import Form from './Form';
import Preview from './Preview';
import {Box} from '@mui/material';
import EnhancedTable from "../../components/Atoms/table/Table"
import {ROLES} from "../constants";
import {showDelete} from "../../actions/component.action";
import {UserSettings} from "../Atoms/client";
import useEnhancedFetch from "../../hooks/useEnhancedFetch";


const Facilities = () => {
    const {path} = useRouteMatch();
    const {add, delete: canDelete, edit} = UserSettings.getUserPermissionsByDashboardId('facilities')
    const { data = {}, loading, refetch, isRefetching, page, limit, onLimitChange, onPageChange, isPaginationLoading } = useEnhancedFetch('/api/warehouse', {
            page: 1,
            limit: 10,
        }),
        {totalCount, warehouses = []} = data || {};

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

    const Actions = <Button variant='contained' component={Link} to={path + '/add'} disabled={!add}>
        Add Facility
    </Button>

    return (
        <Box sx={{height: 'inherit'}}>
            <EnhancedTable config={config} data={warehouses} loading={loading} onRefetch={refetch} isRefetching={isRefetching} actions={Actions}
                           isPaginationLoading={isPaginationLoading}
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