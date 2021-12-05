import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Loads from '../loads/Loads.js';
import Spinner from '../layout/Spinner';
import { TableFooter, TablePagination } from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import { getLoads, searchLoads } from "../../actions/load";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  TableContainer: {
    borderBottom: "none"
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  }
});

const Loadlistbar = ({ getLoads, searchLoads, load: { loads, loads_pagination, page, rowsPerPage, search }, resetSearchField }) => {
  const classes = useStyles();
  const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
  const [loading, setLoading] = useState(true);
  const { total } = loads_pagination;
  const [rawLoades, setRawLoads] = useState([]);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    resetSearchField();
    return () => {
      resetSearchField();
    };
  }, []);

  useEffect(() => {
    if (user && user.role === 'load planner') {
      const filterredLoads = loads.filter(item => {
        if (!item.assignedTo) {
          return item;
        }
      });
      setRawLoads(filterredLoads);
    } else {
      setRawLoads(loads)
    }
  }, [loads])

  const handleChangePage = (event, newPage) => {
    console.log(newPage, query)
    if (query)
      searchLoads(newPage, limit, query);
    else
      getLoads(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = event.target.value;
    if (query)
      searchLoads(0, limit, query);
    else
      getLoads(0, limit);
  };
  return (
    <div className={classes.table}>
      {loading ? <Spinner /> : (
        <Fragment>
          <TableContainer component={Paper} className={classes.TableContainer}>
            <Table borderBottom="none" aria-label="caption table">
              <TableHead className={classes.TableContainer} >
                <TableRow>
                  <TableCell align="center">Load Number</TableCell>
                  <TableCell align="center">PickUp</TableCell>
                  <TableCell align="center">Pickup Date</TableCell>
                  <TableCell align="center">Drop</TableCell>
                  <TableCell align="center">Drop Date</TableCell>
                  <TableCell align="center">Assigned To</TableCell>
                  <TableCell align="center">Load Status</TableCell>
                  <TableCell align="center">Brokerage</TableCell>
                </TableRow>
              </TableHead>
              <Loads classes={classes} rawLoades={rawLoades} />
            </Table>
          </TableContainer>
          <TableFooter style={{ display: 'flex' }}>
            {(!query && rawLoades.length) ? <TablePagination
              className={classes.footer}
              rowsPerPageOptions={[]}
              colSpan={3}
              count={total}
              rowsPerPage={+rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            /> : (query && sLoads.length) ? <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={sTotal}
              rowsPerPage={+limit}
              page={sPage}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            /> : ''}
          </TableFooter>
        </Fragment>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  load: state.load,
  driver: state.driver
});

export default connect(mapStateToProps, { getLoads, searchLoads })(Loadlistbar)