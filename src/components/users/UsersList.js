import React, {Fragment, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUserToEdit, deleteUser } from "../../actions/users";
import EnhancedTable from "../Atoms/table/Table";
import {Box, Button, DialogContentText, Grid, Typography} from "@mui/material";
import Dialog from "../Atoms/Dialog";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import UserForm from "./UserForm";

const UsersList = () => {
    const { list, loading, page, limit, total } = useSelector(
        (state) => state.users
    );
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [dialog, setDialog] = useState({open: false, config: {}});

    const onDialogClose = () => setDialog({...dialog, open: false});

    const afterDelete = ({success, data}) => {
        if(success) {
            onDialogClose();
        }
    }

    const onDelete = (_id, e) => {
        e.stopPropagation();

        const config = {
            title: () => <Grid container alignItems='center' sx={{ p: '16px 24px' }} gap={1}>
                <ErrorOutlineIcon color='error' />
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 550 }} color='error'>Delete</Typography>
            </Grid>,
            okText: 'Delete',
            onOk: () => dispatch(deleteUser(_id, afterDelete)),
            content: () => <DialogContentText sx={{color: '#000'}}>Are you sure you want to delete the user?</DialogContentText>
        }
        setDialog({open: true, config});
    }

    useEffect(() => {
        dispatch(fetchUsers(+page, +limit));
    }, []);

    const handleChangePage = (event, newPage) => {
        dispatch(fetchUsers(newPage - 1, +limit));
    };

    const handleChangeRowsPerPage = (event) => {
        const new_limit = event.target.value;
        dispatch(fetchUsers(0, new_limit));
    };

    const allowedRolesForDispatch = [
        "driver",
        "afterhours",
        "load planner",
        "support",
    ];

    const config = {
        emptyMessage: 'No Users',
        page,
        count: total,
        limit,
        onPageChange: handleChangePage,
        rowCellPadding: 'normal',
        columns: [
            {
                id: 'name',
                label: 'Name',
                renderer: ({ row: { name = '' } }) => name || '--'
            },
            {
                id: 'email',
                label: 'Email'
            },
            {
                id: 'role',
                label: 'Role'
            },
            {
                id: 'actions',
                label: 'Actions',
                renderer: ({ row: { _id, email, role } = {} }) => {
                    return <Fragment>
                        {user && user.role !== "dispatch" ? (
                            <Button sx={{ mr: 1 }} variant='contained' onClick={() => {
                                dispatch(selectUserToEdit({ _id, email, role }))
                            }}>
                                Update
                            </Button>
                        ) : (
                            allowedRolesForDispatch.includes(role) && (
                                <Button variant='contained' onClick={() => {
                                    dispatch(selectUserToEdit({ _id, email, role }))
                                }}>
                                    Update
                                </Button>
                            )
                        )}
                        {user &&
                            (user.role === "user" || user.role === "admin") &&
                            user.role !== "dispatch" &&
                            <Button variant='contained' color='error' onClick={onDelete.bind(this, _id)}>
                                Delete
                            </Button>}
                    </Fragment>
                }
            },
        ]
    }

    return (
        <Fragment>
            <EnhancedTable loading={loading} data={list} config={config} />
            <Box sx={{display :'flex', justifyContent: 'flex-end'}}>
                <UserForm/>
            </Box>
            <Dialog className='enhancedTable_dialog' open={dialog.open} config={dialog.config} onClose={onDialogClose} />
        </Fragment>
    );
};

export default UsersList;
