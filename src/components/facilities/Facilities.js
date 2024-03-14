import React from 'react';
import {Link, useRouteMatch, Switch, Route} from 'react-router-dom';
import {Button} from '@mui/material';
import Form from './Form';
import Preview from './Preview';
import {Box} from '@mui/material';
import EnhancedTable from "../../components/Atoms/table/Table"
import {ROLES} from "../constants";
import {showDelete} from "../../actions/component.action";
import {getUserDetail} from "../../utils/utils";
import useFetch from "../../hooks/useFetch";
import {UserSettings} from "../Atoms/client";


const Facilities = () => {
    const {path} = useRouteMatch();
    const {role = ''} = getUserDetail().user;
    const {add, delete: canDelete} = UserSettings.getUserPermissionsByDashboardId('facilities')
    const /*hasPermission = [ROLES.admin, ROLES.dispatch, ROLES.support].includes(role),*/
        { data = {}, loading, refetch, isRefetching } = useFetch('/api/warehouse'),
        {totalCount, warehouses = []} = data || {};

    const afterDelete = ({success}) => {
        if (success) {
            refetch();
        }
    }

    const config = {
        count: totalCount,
        deletePermissions: ['admin', 'superAdmin'],
        onRowClick: ({_id}) => `${path}/preview/${_id}`,
        rowCellPadding: 'normal',
        showRefresh: true,
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

    return (
        <div>
            <Box>
                <EnhancedTable config={config} data={warehouses} loading={loading} onRefetch={refetch} isRefetching={isRefetching} />
            </Box>
            {!!add && <Button variant='contained' component={Link} to={path + '/add'}
                                      sx={{position: 'absolute', right: 10}}>Add Facility</Button>}
            <Switch>
                <Route render={(props) => <Form {...props} refetch={refetch} />} path={path + '/add'}/>
                <Route render={(props) => <Form {...props} refetch={refetch} />} path={path + '/edit/:id'} refetch={refetch} />
                <Route render={(props) => <Preview {...props} closeUrl={path}/>} path={path + '/preview/:id'}/>
            </Switch>
        </div>
    )
}

export default Facilities;