import React, { Fragment, useEffect } from 'react';
import { Link, useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { deleteWarehouse, getWarehouses } from '../../actions/warehouse';
import Spinner from '../layout/Spinner';
import { Button, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Form from './Form';
import Preview from './Preview';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
        position: 'relative'
    },
    TableContainer: {
        borderBottom: "none"
    },
    addNewIcon: {
        color: '#1891FC',
        // color: 'white',
        textTransform: 'none',
        position: 'absolute',
        right: 0,
    }
});

const List = ({ data = {}, history, path, dispatch }) => {
    const { warehouses = [] } = data

    const onRowClick = (row = {}) => {
        const { _id: id = '' } = row;
        history.push(`${path}/warehouse/${id}`)
    }

    const onDelete = (id, e) => {
        e.stopPropagation();
        dispatch(deleteWarehouse(id));
    }

    const cells = warehouses.length && warehouses.map(data => {
        const { address = "", averageLoadTime = "", city = "delhi", name = "", state = "", zip = "" } = data;
        return (
            <TableRow onClick={onRowClick.bind(null, data)} hover>
                <TableCell align="center">{name}</TableCell>
                <TableCell align="center">{address}</TableCell>
                <TableCell align="center">{city}</TableCell>
                <TableCell align="center">{state}</TableCell>
                <TableCell align="center">{zip}</TableCell>
                <TableCell align="center">{averageLoadTime}</TableCell>
                <TableCell component="th" scope="row" align="center">
                    <IconButton onClick={onDelete.bind(this, data._id)}>
                        <Delete style={{ color: "rgb(220, 0, 78)" }} />
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    })

    return (
        <Fragment>
            {cells}
        </Fragment>
    )
}

export const Warehouse = ({ resetSearchField, ...rest }) => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { warehouse: { totalCount, warehouses = [], loading = false } = {}, auth: { user: { role = '' } = {} } = {} } = useSelector(state => state);
    const hasPermission = role === 'admin' || role === 'dispatch' || role === 'support';

    useEffect(() => {
        dispatch(getWarehouses())
        return () => {
            resetSearchField();
        };
    }, []);

    return (
        <div className={classes.table}>
            {(loading || warehouses.length <= 0) ? <Spinner /> : (<TableContainer component={Paper} className={classes.TableContainer}>
                <Table borderBottom="none" aria-label="caption table" hover>
                    <TableHead className={classes.TableContainer} >
                        <TableRow>
                            <TableCell align="center">WareHouse</TableCell>
                            <TableCell align="center">Address</TableCell>
                            <TableCell align="center">City</TableCell>
                            <TableCell align="center">State</TableCell>
                            <TableCell align="center">Zip Date</TableCell>
                            <TableCell align="center">Average Load Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <List data={warehouses} history={history} path={path} dispatch={dispatch} />
                </Table>
            </TableContainer>)}
            {hasPermission && <Button variant='outlined' component={Link} to={path + '/warehouse/add'} className={classes.addNewIcon}>+ Add Warehouse</Button>}
            <Switch>
                <Route component={Form} path={path + '/warehouse/add'} />
                <Route component={Form} path={path + '/warehouse/edit/:id'} />
                <Route component={Preview} path={path + '/warehouse/:id'} />
            </Switch>
        </div>
    )
}