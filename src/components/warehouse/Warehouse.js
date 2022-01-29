import React, { Fragment, useEffect } from 'react';
import { Link, useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { deleteWarehouse, getWarehouses } from '../../actions/warehouse';
import Spinner from '../layout/Spinner';
import { Button, IconButton, ThemeProvider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Form from './Form';
import Preview from './Preview';
import { Delete } from '@material-ui/icons';
import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import EnhancedTable from "../../components/Atoms/table/Table"

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

const theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '11px',
                    fontWeight: 400,
                    borderBottom: '1px solid #0000000D',
                    paddingLeft: '1rem',
                    align: 'left'
                }
            }
        }
    }
})

const List = ({ data = {}, history, path, dispatch }) => {
    const { warehouses = [] } = data,
        tableRowSx = { color: '#525F7F' }

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
                <TableCell sx={tableRowSx} padding={'none'}>{name}</TableCell>
                <TableCell sx={tableRowSx} padding={'none'}>{address}</TableCell>
                <TableCell sx={tableRowSx} padding={'none'}>{city}</TableCell>
                <TableCell sx={tableRowSx} padding={'none'}>{state}</TableCell>
                <TableCell sx={tableRowSx} padding={'none'}>{zip}</TableCell>
                <TableCell sx={tableRowSx} padding={'none'}>{averageLoadTime}</TableCell>
                <TableCell sx={tableRowSx} padding={'none'} component="th" scope="row">
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

export const Warehouse = ({ resetSearchField }) => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { warehouse: { totalCount, warehouses = [], loading = false } = {}, auth: { user: { role = '' } = {} } = {} } = useSelector(state => state);
    const hasPermission = role === 'admin' || role === 'dispatch' || role === 'support',
        tableHeaderSx = { color: '#8898AA', height: 40 };

    const config = {
        hasDelete: true,
        count: totalCount,
        onRowClick: ({ _id }) => `${path}/warehouse/${_id}`,
        onDelete: (id) => dispatch(deleteWarehouse(id)),
        columns: [
            {
                id: 'name',
                label: 'Warehouse'
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
        <ThemeProvider theme={theme}>
            <div className={classes.table}>
                    <Box>
                        <EnhancedTable config={config} data={warehouses.warehouses} loading={loading} />
                    </Box>
                {hasPermission && <Button variant='outlined' component={Link} to={path + '/warehouse/add'} sx={{position: 'absolute', right: 0}}>Add Warehouse</Button>}
                <Switch>
                    <Route component={Form} path={path + '/warehouse/add'} />
                    <Route component={Form} path={path + '/warehouse/edit/:id'} />
                    <Route component={Preview} path={path + '/warehouse/:id'} />
                </Switch>
            </div>
        </ThemeProvider>
    )
}