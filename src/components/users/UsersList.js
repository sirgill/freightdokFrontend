import React, {Fragment, useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers, selectUserToEdit, deleteUser} from "../../actions/users";
import Spinner from "../layout/Spinner";
import {capitalizeFirstLetter} from "../../utils/helper";
import {useStyles} from "../HelperCells";
import EnhancedTable from "../Atoms/table/Table";
import load from "../../reducers/load";
import {Button} from "@mui/material";
import Pagination from "../Atoms/table/Pagination";

const UsersList = () => {
    const classes = useStyles();
    const {list, loading, page, limit, total} = useSelector(
        (state) => state.users
    );
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers(+page, +limit));
    }, []);

    const handleChangePage = (event, newPage) => {
        dispatch(fetchUsers(newPage-1, +limit));
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
        headerCellSx: {pt: 1, pb: 1},
        rowCellPadding: 'inherit',
        columns: [
            {
                id: 'name',
                label: 'Name',
                renderer: ({row: {name = ''}}) => name || '--'
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
                renderer: ({row: {_id, email, role} = {}}) => {
                    return <Fragment>
                        {user && user.role !== "dispatch" ? (
                            <Button sx={{mr: 1}} variant='contained' onClick={() => {
                                dispatch(selectUserToEdit({_id, email, role}))
                            }}>
                                Update
                            </Button>
                        ) : (
                            allowedRolesForDispatch.includes(role) && (
                                <Button variant='contained' onClick={() => {
                                    dispatch(selectUserToEdit({_id, email, role}))
                                }}>
                                    Update
                                </Button>
                            )
                        )}
                        {user &&
                        (user.role === "user" || user.role === "admin") &&
                        user.role !== "dispatch" &&
                        <Button variant='contained' color='error' onClick={() => {
                            dispatch(deleteUser(_id));
                        }}>
                            Delete
                        </Button>}
                    </Fragment>
                }
            },
        ]
    }

    return (
        <Fragment>
            <EnhancedTable loading={loading} data={list} config={config}/>
        </Fragment>
    );
};

export default UsersList;
