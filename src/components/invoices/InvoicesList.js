import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { resetLoadsSearch } from '../../actions/load.js';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from "../layout/Spinner";
import Invoices from './Invoices.js';
import { getInvoiceLoads } from "../../actions/load";

const useStyles = makeStyles({
    table: {
      width: 'calc(100vw - 278px)',
    },
    TableContainer: {
     borderBottom: "none"
    },
    loadSearchbar: {
        textAlign: 'right',
        paddingBottom: 10
    },
});

export default function InvoicesList({ setSelectedLoad, resetSearchField, listBarType, load_selected }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { page, limit, total } = useSelector(state => state.load.invoices);
    useEffect(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      resetSearchField();
      dispatch(resetLoadsSearch(listBarType));
      return () => {
        resetSearchField();
        dispatch(resetLoadsSearch(listBarType));
      }
    }, []);
    const handleChangePage = (event, newPage) => {
      dispatch(getInvoiceLoads(newPage, limit));
    };
    const handleChangeRowsPerPage = (event) => {
      const limit = event.target.value;
      dispatch(getInvoiceLoads(0, limit));
    };
    return (
      <div className={classes.table}>
        { loading ? <Spinner /> : (<TableContainer component={Paper} className={classes.TableContainer}>
          <Table borderBottom="none" aria-label="caption table">
            <TableHead className={classes.TableContainer} >
              <TableRow>
                <TableCell align="center">Load #</TableCell>
                <TableCell align="center">Broker</TableCell>
                <TableCell align="center">Rate</TableCell>
                <TableCell align="center">Rate Confirmation</TableCell>
                <TableCell align="center">Proof of delivery</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <Invoices showWizardFor={(data)=>setSelectedLoad(data)}/>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  colSpan={3}
                  count={+total}
                  rowsPerPage={+limit}
                  page={+page}
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
        </TableContainer>)}
      </div>
    )
}