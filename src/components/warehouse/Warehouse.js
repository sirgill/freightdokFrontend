import React, {useEffect} from 'react';
import {Link, useRouteMatch, Switch, Route} from 'react-router-dom';
import {getWarehouses} from '../../actions/warehouse';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import Form from './Form';
import Preview from './Preview';
import {Box} from '@mui/material';
import EnhancedTable from "../../components/Atoms/table/Table"
import {ROLES} from "../constants";
import {showDelete} from "../../actions/component.action";
import {getUserDetail} from "../../utils/utils";


const Warehouse = () => {
    const {path} = useRouteMatch();
    const dispatch = useDispatch();
    const {totalCount, warehouses = [], loading = false} = useSelector(state => state.warehouse)
    const {role = ''} = getUserDetail().user;
    const hasPermission = [ROLES.admin, ROLES.dispatch, ROLES.support].includes(role)

    const afterDelete = ({success}) => {
        if (success) {
            dispatch(getWarehouses());
        }
    }

    const config = {
        count: totalCount,
        deletePermissions: ['admin', 'superAdmin'],
        onRowClick: ({_id}) => `${path}/preview/${_id}`,
        rowCellPadding: 'normal',
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
                id: 'averageLoadTime',
                label: 'Average Load Time'
            },
            {
                id: 'actions',
                visible: ({role}) => role === ROLES.admin || role === ROLES.superadmin,
                renderer: ({row: {_id, name}}) => {
                    return <Button
                        variant='contained'
                        color='error'
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

    useEffect(() => {
        dispatch(getWarehouses())
    }, []);

    return (
        <div>
            <Box>
                <EnhancedTable config={config} data={warehouses.warehouses} loading={loading}/>
            </Box>
            {hasPermission && <Button variant='contained' component={Link} to={path + '/add'}
                                      sx={{position: 'absolute', right: 10}}>Add Facility</Button>}
            <Switch>
                <Route component={Form} path={path + '/add'}/>
                <Route component={Form} path={path + '/edit/:id'}/>
                <Route render={(props) => <Preview {...props} closeUrl={path}/>} path={path + '/preview/:id'}/>
            </Switch>
        </div>
    )
}

export default Warehouse;