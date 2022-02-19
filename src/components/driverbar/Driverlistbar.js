import React, {Fragment} from "react";
import { connect } from "react-redux";
import {Button} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Drivers from "../drivers/Drivers.js";
import { useStyles } from "../HelperCells.js";
import EnhancedTable from "../Atoms/table/Table";
import { getDrivers } from "../../actions/driver";
import {
  patchDriverLoads,
  deleteDriverLoads,
  deleteDriver,
} from "../../actions/driver";

const Driverlistbar = (props={}) => {
  const {driver: {drivers = [], loading=false}, deleteDriver} = props;
  const classes = useStyles();

  const handleDeleteDriver = (driver={}) => {
    const _id = typeof driver.user !== "string" ? driver.user._id : driver.user;
    deleteDriver(_id);
  };

  const tableConfig = {
    rowCellPadding: 'inherit',
    emptyMessage: 'No drivers found',
    columns: [
      {
        id: 'firstName',
        label :'First Name'
      },
      {
        id: 'lastName',
        label :'Last Name'
      },
      {
        id: 'phoneNumber',
        label :'Phone Number'
      },
      {
        id: 'delete',
        renderer: ({row}) => {
          return <Fragment>
            <Button onClick={handleDeleteDriver.bind(null, row)} variant='outlined' color='error'>
              Delete
            </Button>
          </Fragment>
        }
      }
    ]
  }

  return (
    <div className={classes.table}>
      <EnhancedTable  config={tableConfig} data={drivers} loading={loading} />
      {/*<TableContainer component={Paper} className={classes.TableContainer}>*/}
      {/*  <Table borderBottom="none" aria-label="caption table">*/}
      {/*    <TableHead className={classes.TableContainer}>*/}
      {/*      <TableRow>*/}
      {/*        <TableCell />*/}
      {/*        <TableCell align="center">First Name</TableCell>*/}
      {/*        <TableCell align="center">Last Name</TableCell>*/}
      {/*        <TableCell align="center">Phone #</TableCell>*/}
      {/*        <TableCell align="center" />*/}
      {/*      </TableRow>*/}
      {/*    </TableHead>*/}
      {/*    <Drivers />*/}
      {/*  </Table>*/}
      {/*</TableContainer>*/}
    </div>
  );
};

const mapStateToProps = (state) => ({
  driver: state.driver
})

export default connect(mapStateToProps, {
  getDrivers,
  patchDriverLoads,
  deleteDriverLoads,
  deleteDriver,
})(Driverlistbar)
