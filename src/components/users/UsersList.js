import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, selectUserToEdit, deleteUser } from '../../actions/users';
import Spinner from '../layout/Spinner';
import { capitalizeFirstLetter } from '../../utils/helper';

const useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
    TableContainer: {
     borderBottom: "none"
    }
});

const UsersList = () => {

    const classes = useStyles();
    const { list, loading, page, limit, total } = useSelector(state => state.users);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchUsers(+page, +limit));
    }, []);

    const handleChangePage = (event, newPage) => {
      dispatch(fetchUsers(newPage, +limit));
    };

    const handleChangeRowsPerPage = (event) => {
      const new_limit = event.target.value;
      dispatch(fetchUsers(0, new_limit));
    };

    const allowedRolesForDispatch = ['driver', 'afterhours', 'load planner', 'support']

    return <TableContainer component={Paper} className={classes.TableContainer}>
    <Table borderBottom="none" aria-label="caption table">
      <TableHead className={classes.TableContainer} >
        <TableRow>
          <TableCell />
          <TableCell align="center">Name</TableCell>
          <TableCell align="center">Email</TableCell>
          <TableCell align="center">Role</TableCell>
          <TableCell align="center">Actions</TableCell>
          <TableCell align="center" />
        </TableRow>
      </TableHead>
      <TableBody>
            { !loading ? list.length > 0 ? list.map(({ _id, name, email, role }) => <TableRow key={_id}>
                <TableCell align="center" />
                <TableCell align="center">{name ? name : '--'}</TableCell>
                <TableCell align="center">{email}</TableCell>
                <TableCell align="center">{capitalizeFirstLetter(role)}</TableCell>
                <TableCell align="center">

                    {(user && user.role !== 'dispatch') ? <IconButton>
                        <EditIcon color="primary" onClick={() => {dispatch(selectUserToEdit({_id, email, role}))}}/>
                    </IconButton> : 
                    
                    allowedRolesForDispatch.includes(role) && <IconButton>
                      <EditIcon color="primary" onClick={() => {dispatch(selectUserToEdit({_id, email, role}))}}/>
                    </IconButton>}

                    { (user && ((user.role === 'user' || user.role === 'admin') && user.role !== 'dispatch')) && <IconButton >
                        <DeleteIcon  onClick={() => {dispatch(deleteUser(_id))}} style={{ color: "rgb(220, 0, 78)" }} />
                    </IconButton> }
                </TableCell>
                <TableCell align="center" />
          </TableRow>) : <h4>No Users</h4> : <Spinner /> }
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            colSpan={3}
            count={total}
            rowsPerPage={+limit}
            page={page}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  </TableContainer>
}

export default UsersList;