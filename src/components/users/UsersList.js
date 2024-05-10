import React, {Fragment, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers} from "../../actions/users";
import EnhancedTable from "../Atoms/table/Table";
import {Button} from "@mui/material";
import {showDelete} from "../../actions/component.action";
import {getRoleNameString} from "../client/constants";
import {UserSettings} from "../Atoms/client";
import {Route} from "react-router-dom";
import Form from "./Form";
import AddIcon from "@mui/icons-material/Add";

const UsersList = (props) => {
    const {delete: hasDeletePermission, edit, add} = UserSettings.getUserPermissionsByDashboardId('users') || {};
    const {match: {path} = {}, history} = props,
        { list, loading, page = 1, limit = 10, total } = useSelector(
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
        dispatch(fetchUsers(newPage, +limit));
    };

    const onPageSizeChange = ({value}) => {
        dispatch(fetchUsers(1, value));
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
                renderer: ({ row = {} }) => {
                    const { _id, email, role, firstName, lastName } = row;
                    // onDelete.bind(this, _id)
                    return <Fragment>
                        <Button variant='contained' sx={{mr: 1}} disabled={!edit}
                            onClick={() => history.push(path + '/' + _id)}
                        >
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

    const Actions = () => <Button disabled={!add} variant={'contained'} startIcon={<AddIcon />} onClick={() => history.push(path + '/add')}>Add</Button>

    return (
        <Fragment>
            <EnhancedTable loading={loading} data={list} config={config} onRefetch={() => dispatch(fetchUsers(+page, +limit))} actions={<Actions />}/>
            <Route path={path + '/:id'} render={(props) => <Form onCloseUrl={path} {...props} onRefetch={() => dispatch(fetchUsers(+page, +limit))} />} />
        </Fragment>
    );
};

export default UsersList;
