import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Loads  from '../loads/Loads.js';
import Spinner from '../layout/Spinner';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  TableContainer: {
   borderBottom: "none"
  }
});

export const Loadlistbar = ({ resetSearchField }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    resetSearchField();
    return () => {
      resetSearchField();
    };
  }, []);
  return (
    <div className={classes.table}>
      { loading ? <Spinner /> : (<TableContainer component={Paper} className={classes.TableContainer}>
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
          <Loads />
        </Table>
      </TableContainer>) }
    </div>
  )
}