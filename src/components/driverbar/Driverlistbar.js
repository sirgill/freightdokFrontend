import React, {useEffect, useState} from "react";
import {connect, shallowEqual, useDispatch, useSelector} from "react-redux";
import {Box, IconButton} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import EnhancedTable from "../Atoms/table/Table";
import {getDrivers} from "../../actions/driver";
import {
    patchDriverLoads,
    deleteDriverLoads,
    deleteDriver,
} from "../../actions/driver";
import EditDriver from "../driver-forms/AddDriver";
import AddDriverForm from "../driver-forms/AddDriver";
import {UserSettings} from "../Atoms/client";
import {Tooltip} from "../Atoms";

const {edit: canEdit, delete: canDelete } = UserSettings.getUserPermissionsByDashboardId('drivers')

const Driverlistbar = (props = {}) => {
    const {deleteDriver} = props;
    const {drivers = [], loading = false} = useSelector((state) => state.driver, shallowEqual);
    const [edit, setEdit] = useState({open: false, data: {}});
    const dispatch = useDispatch();

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
        fetchDrivers()

    }, [])


    const tableConfig = {
        rowCellPadding: 'normal',
        emptyMessage: 'No drivers found',
        // onRowClick: (row) => setEdit({open: true, data: row}),
        hasDelete: true,
        deletePermissions: !!canDelete,
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
                    return <Tooltip title='Edit' placement='top'>
                        <IconButton disabled={!canEdit} variant={'contained'} sx={{mr: 2}} onClick={handleUpdate.bind(this, row)} color='primary'>
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                }
            }
        ]
    }

    const closeEditForm = () => {
        setEdit({open: false, data: {}});
    }

    const Actions = <Box sx={{display :'flex', justifyContent: 'flex-end'}}>
        <AddDriverForm/>
    </Box>

    return (
        <div className='dashboardRoot'>
            <EnhancedTable config={tableConfig} data={drivers} loading={loading} actions={Actions}/>
            {edit.open && <EditDriver closeEditForm={closeEditForm} data={edit.data} isEdit={true} onRefresh={fetchDrivers} />}
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
