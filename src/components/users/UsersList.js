import React, {Fragment, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUserToEdit } from "../../actions/users";
import EnhancedTable from "../Atoms/table/Table";
import {Box, Button} from "@mui/material";
import UserForm from "./UserForm";
import {ROLES} from "../constants";
import {showDelete} from "../../actions/component.action";

const UsersList = () => {
    const { list, loading, page, limit, total } = useSelector(
        (state) => state.users
    );
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();


    const afterDelete = ({success}) => {
        if(success) {
            dispatch(fetchUsers(+page, +limit));
        }
    }


    useEffect(() => {
        dispatch(fetchUsers(+page, +limit));
    }, [dispatch]);

    const handleChangePage = (event, newPage) => {
        dispatch(fetchUsers(newPage - 1, +limit));
    };

    const handleChangeRowsPerPage = (event) => {
        const new_limit = event.target.value;
        dispatch(fetchUsers(0, new_limit));
    };

    const allowedRolesForDispatch = [
        ROLES.dispatch,
        ROLES.admin,
        ROLES.superadmin,
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
                emptyState: '--',
                renderer: ({ row: { name = '' } }) => name
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
                renderer: ({ row: { _id, email, role } = {}, role: userRole }) => {
                    // onDelete.bind(this, _id)
                    return <Fragment>
                        {allowedRolesForDispatch.includes(userRole) && (
                                <Button variant='contained' sx={{mr: 1}} onClick={() => {
                                    dispatch(selectUserToEdit({ _id, email, role }))
                                }}>
                                    Update
                                </Button>
                            )
                        }
                        {user &&
                            [ROLES.admin, ROLES.superadmin].includes(user.role) &&
                            <Button variant='contained' color='error' onClick={() => showDelete({
                                message: 'Are you sure you want to delete the user?',
                                uri: `/api/users/${_id}`,
                                afterSuccessCb: afterDelete
                            })}>
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
                <UserForm />
            </Box>
        </Fragment>
    );
};

export default UsersList;
