import React, {Fragment, useEffect, useState} from "react";
import {connect, shallowEqual, useDispatch, useSelector} from "react-redux";
import {Button} from "@mui/material";
import moment from "moment";

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
    const {deleteDriver} = props;
    const {drivers = [], loading = false, timestamp} = useSelector((state) => state.driver, shallowEqual);
    const [edit, setEdit] = useState({open: false, data: {}});
    const classes = useStyles(),
        dispatch = useDispatch();

    const handleDeleteDriver = (driver = {}, e) => {
        e.stopPropagation();
        const _id = typeof driver.user !== "string" ? driver.user._id : driver.user;
        deleteDriver(_id);
    };

    const handleUpdate = (row = {}, e) => {
        e.stopPropagation();
        setEdit({open: true, data: row})
    };

    useEffect(() => {
        const now = moment(new Date());
        const end = moment(timestamp);
        const duration = moment.duration(now.diff(end));
        if(duration.asMinutes() > 5 || typeof timestamp === 'undefined'){
            dispatch(getDrivers());
        }

    }, [])


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
