import React, {Fragment, useEffect, useState} from "react";
import {connect, shallowEqual, useDispatch, useSelector} from "react-redux";
import {Box, Button} from "@mui/material";
import moment from "moment";

import {useStyles} from "../HelperCells.js";
import EnhancedTable from "../Atoms/table/Table";
import {getDrivers} from "../../actions/driver";
import {
    patchDriverLoads,
    deleteDriverLoads,
    deleteDriver,
} from "../../actions/driver";
import EditDriver from "../driver-forms/AddDriver";
import AddDriverForm from "../driver-forms/AddDriver";
import {showDelete} from "../../actions/component.action";
import {ROLES} from "../constants";

const Driverlistbar = (props = {}) => {
    const {deleteDriver} = props;
    const {drivers = [], loading = false, timestamp} = useSelector((state) => state.driver, shallowEqual);
    const [edit, setEdit] = useState({open: false, data: {}});
    const classes = useStyles(),
        dispatch = useDispatch();

    const handleDeleteDriver = (driver = {}, onDialogClose, {row}) => {
        const _id = typeof row.user !== "string" ? row.user._id : row.user;
        deleteDriver(_id, onDialogClose);
    };

    const handleUpdate = (row = {}, e) => {
        e.stopPropagation();
        setEdit({open: true, data: row})
    };

    const fetchDrivers = () => {
        dispatch(getDrivers());
    }

    useEffect(() => {
        const now = moment(new Date());
        const end = moment(timestamp);
        const duration = moment.duration(now.diff(end));
        // if(duration.asMinutes() > 5 || typeof timestamp === 'undefined'){
        // }
        fetchDrivers()

    }, [])


    const tableConfig = {
        rowCellPadding: 'inherit',
        emptyMessage: 'No drivers found',
        // onRowClick: (row) => setEdit({open: true, data: row}),
        hasDelete: true,
        deletePermissions: [ROLES.superadmin, ROLES.admin, ROLES.dispatch],
        deleteMessage: ({row}) => 'Are you sure you want to delete ' + row.firstName + " " + (row.lastName || '') + '?',
        onDelete: handleDeleteDriver,
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
            {edit.open && <EditDriver closeEditForm={closeEditForm} data={edit.data} isEdit={true} onRefresh={fetchDrivers} />}
            <Box sx={{display :'flex', justifyContent: 'flex-end'}}>
                <AddDriverForm/>
            </Box>
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
