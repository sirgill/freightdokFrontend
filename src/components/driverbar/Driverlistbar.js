import React, {Fragment, useState} from "react";
import {connect} from "react-redux";
import {Button} from "@mui/material";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Drivers from "../drivers/Drivers.js";
import {useStyles} from "../HelperCells.js";
import EnhancedTable from "../Atoms/table/Table";
import {getDrivers} from "../../actions/driver";
import {
    patchDriverLoads,
    deleteDriverLoads,
    deleteDriver,
} from "../../actions/driver";
import EditDriver from "../driver-forms/AddDriver";

const Driverlistbar = (props = {}) => {
    const {driver: {drivers = [], loading = false}, deleteDriver} = props;
    const [edit, setEdit] = useState({open: false, data: {}});
    const classes = useStyles();

    const handleDeleteDriver = (driver = {}, e) => {
        e.stopPropagation();
        const _id = typeof driver.user !== "string" ? driver.user._id : driver.user;
        deleteDriver(_id);
    };

    const handleUpdate = (row = {}, e) => {
        e.stopPropagation();
        setEdit({open: true, data: row})
    };


    const tableConfig = {
        rowCellPadding: 'inherit',
        emptyMessage: 'No drivers found',
        // onRowClick: (row) => setEdit({open: true, data: row}),
        columns: [
            {
                id: 'firstName',
                label: 'First Name'
            },
            {
                id: 'lastName',
                label: 'Last Name'
            },
            {
                id: 'phoneNumber',
                label: 'Phone Number'
            },
            {
                id: 'delete',
                renderer: ({row}) => {
                    return <Fragment>
                        <Button variant={'contained'} sx={{mr: 2}} onClick={handleUpdate.bind(this, row)}
                                color='primary'>
                            Update
                        </Button>
                        <Button variant={'contained'} onClick={handleDeleteDriver.bind(this, row)} color='error'>
                            Delete
                        </Button>
                    </Fragment>
                }
            }
        ]
    }

    const closeEditForm = () => {
        setEdit({open: false, data: {}});
    }

    return (
        <div className={classes.table}>
            <EnhancedTable config={tableConfig} data={drivers} loading={loading}/>
            {edit.open && <EditDriver closeEditForm={closeEditForm} data={edit.data} isEdit={true}/>}
            {/*<TableContainer component={Paper} className={classes.TableContainer}>*/}
            {/*  <Table borderBottom="none" aria-label="caption table">*/}
            {/*    <TableHead className={classes.TableContainer}>*/}
            {/*      <TableRow>*/}
            {/*        <TableCell />*/}
            {/*        <TableCell align="center">First Name</TableCell>*/}
            {/*        <TableCell align="center">Last Name</TableCell>*/}
            {/*        <TableCell align="center">Phone #</TableCell>*/}
            {/*        <TableCell align="center" />*/}
            {/*      </TableRow>*/}
            {/*    </TableHead>*/}
            {/*    <Drivers />*/}
            {/*  </Table>*/}
            {/*</TableContainer>*/}
        </div>
    );
};

const mapStateToProps = (state) => ({
    driver: state.driver
})

export default connect(mapStateToProps, {
    getDrivers,
    patchDriverLoads,
    deleteDriverLoads,
    deleteDriver,
})(Driverlistbar)
