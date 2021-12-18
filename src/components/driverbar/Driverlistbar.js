import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Drivers from "../drivers/Drivers.js";
import { useStyles } from "../HelperCells.js";

export const Driverlistbar = ({}) => {
  const classes = useStyles();

  return (
    <div className={classes.table}>
      <TableContainer component={Paper} className={classes.TableContainer}>
        <Table borderBottom="none" aria-label="caption table">
          <TableHead className={classes.TableContainer}>
            <TableRow>
              <TableCell />
              <TableCell align="center">First Name</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">Phone #</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <Drivers />
        </Table>
      </TableContainer>
    </div>
  );
};
