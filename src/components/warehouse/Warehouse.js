import React, {useEffect} from 'react';
import {Link, useRouteMatch, Switch, Route} from 'react-router-dom';
import {deleteWarehouse, getWarehouses} from '../../actions/warehouse';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import Form from './Form';
import Preview from './Preview';
import {Box} from '@mui/material';
import EnhancedTable from "../../components/Atoms/table/Table"

// const useStyles = makeStyles({
//     table: {
//         minWidth: 700,
//         position: 'relative'
//     },
//     TableContainer: {
//         borderBottom: "none"
//     },
//     addNewIcon: {
//         // color: 'white',
//         textTransform: 'none',
//         position: 'absolute',
//         right: 0,
//     }
// });


export const Warehouse = ({resetSearchField}) => {
    const {path} = useRouteMatch();
    const dispatch = useDispatch();
    const {warehouse: {totalCount, warehouses = [], loading = false} = {}, auth: {user: {role = ''} = {}} = {}} = useSelector(state => state);
    const hasPermission = role === 'admin' || role === 'dispatch' || role === 'support'

    const config = {
        hasDelete: true,
        count: totalCount,
        onRowClick: ({_id}) => `${path}/warehouse/${_id}`,
        onDelete: (id) => dispatch(deleteWarehouse(id)),
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
            }
        ]
    }

    useEffect(() => {
        dispatch(getWarehouses())
        return () => {
            resetSearchField();
        };
    }, []);

    return (
        <div>
            <Box>
                <EnhancedTable config={config} data={warehouses.warehouses} loading={loading}/>
            </Box>
            {hasPermission && <Button variant='contained' component={Link} to={path + '/warehouse/add'}
                                      sx={{position: 'absolute', right: 0}}>Add Warehouse</Button>}
            <Switch>
                <Route component={Form} path={path + '/warehouse/add'}/>
                <Route component={Form} path={path + '/warehouse/edit/:id'}/>
                <Route component={Preview} path={path + '/warehouse/:id'}/>
            </Switch>
        </div>
    )
}