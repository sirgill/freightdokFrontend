import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LoadsWithStatus from './LoadsWithStatus.js';
import { makeStyles } from '@material-ui/core/styles';
import { resetLoadsSearch } from '../../actions/load.js';
import { useDispatch } from 'react-redux';
import Spinner from "../layout/Spinner";

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

export default function LoadsStatus({ resetSearchField, listBarType }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
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
    return (
      <div className={classes.table}>
        { loading ? <Spinner /> : (<TableContainer component={Paper} className={classes.TableContainer}>
          <Table borderBottom="none" aria-label="caption table">
            <TableHead className={classes.TableContainer} >
              <TableRow>
                {/* <TableCell align="center"></TableCell> */}
                <TableCell align="center">Load #</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Pick</TableCell>
                <TableCell align="center">Drop</TableCell>
                <TableCell align="center">Rate Confirmation</TableCell>
                <TableCell align="center">Proof of delivery</TableCell>
                <TableCell align="center">Accessorials</TableCell>
                {/* <TableCell align="center" /> */}
              </TableRow>
            </TableHead>
              <LoadsWithStatus listBarType={listBarType}/>
          </Table>
        </TableContainer>)}
      </div>
    )
}