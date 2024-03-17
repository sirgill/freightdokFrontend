import React, {Fragment, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers, selectUserToEdit} from "../../actions/users";
import EnhancedTable from "../Atoms/table/Table";
import {Box, Button} from "@mui/material";
import UserForm from "./UserForm";
import {showDelete} from "../../actions/component.action";
import {getRoleNameString} from "../client/constants";
import {UserSettings} from "../Atoms/client";

const {delete: hasDeletePermission, edit} = UserSettings.getUserPermissionsByDashboardId('users');

const UsersList = () => {
    const { list, loading, page = 0, limit = 10, total } = useSelector(
        (state) => state.users
    );
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

    const onPageSizeChange = ({value}) => {
        dispatch(fetchUsers(0, value));
    };

    const config = {
        emptyMessage: 'No Users found',
        page,
        count: total,
        limit,
        onPageChange: handleChangePage,
        rowCellPadding: 'normal',
        showRefresh: true,
        onPageSizeChange,
        columns: [
            {
                id: 'name',
                label: 'Name',
                emptyState: '--',
                renderer: ({ row: { name = '', firstName, lastName } }) => name || `${firstName || '--'} ${lastName || ''}`
            },
            {
                id: 'email',
                label: 'Email'
            },
            {
                id: 'role',
                label: 'Role',
                valueFormatter: getRoleNameString
            },
            {
                id: 'actions',
                label: 'Actions',
                renderer: ({ row: { _id, email, role, rolePermissionId } = {} }) => {
                    // onDelete.bind(this, _id)
                    return <Fragment>
                        <Button variant='contained' sx={{mr: 1}} disabled={!edit} onClick={() => {
                            dispatch(selectUserToEdit({ _id, email, role, rolePermissionId }))
                        }}>
                            Update
                        </Button>
                        <Button variant='contained' disabled={!hasDeletePermission} color='error' onClick={showDelete({
                            message: 'Are you sure you want to delete '+ email + '?',
                            uri: `/api/users/${_id}`,
                            afterSuccessCb: afterDelete
                        })}>
                            Delete
                        </Button>
                    </Fragment>
                }
            },
        ]
    }

    const Actions = () => {
        return <Box sx={{display :'flex', justifyContent: 'flex-end'}}>
            <UserForm />
        </Box>
    }

    return (
        <Fragment>
            <EnhancedTable loading={loading} data={list} config={config} onRefetch={() => dispatch(fetchUsers(+page, +limit))} actions={<Actions />}/>
        </Fragment>
    );
};

export default UsersList;
