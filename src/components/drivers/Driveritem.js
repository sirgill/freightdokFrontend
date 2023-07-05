import React, { useState, useEffect } from "react";
//redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLoads } from "../../actions/load";
import {
  patchDriverLoads,
  deleteDriverLoads,
  deleteDriver,
} from "../../actions/driver";

//Material
// import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { useStyles } from "../HelperCells";

var _ = require("lodash");

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 350,
    },
  },
};

function getStyles(name, loads, theme) {
  return {
    fontWeight:
      loads.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const DriverItem = ({
  user,
  patchDriverLoads,
  deleteDriver,
  deleteDriverLoads,
  load: { loads, allLoads, loading },
  driver,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [loadDialog, setLoadDialog] = useState(false);
  const [additionalLoads, setAdditionalLoads] = useState([]);
  const [addLoadsButtonDisabled, setAddLoadsButtonDisabled] = useState(false);
  const [filteredLoads, setFilteredLoads] = useState([]);

  useEffect(() => {
    setFilteredLoads(_.differenceBy(allLoads, driver.loads, "_id"));
  }, []);

  useEffect(() => {
    setFilteredLoads(_.differenceBy(allLoads, driver.loads, "_id"));
  }, [driver]);

  useEffect(() => {
    if (filteredLoads.length === 0) {
      setAddLoadsButtonDisabled(true);
    } else {
      setAddLoadsButtonDisabled(false);
    }
  }, [filteredLoads]);

  const handleLoadsChange = (e) => {
    setAdditionalLoads(e.target.value);
  };

  const onPatch = async () => {
    const _id = typeof driver.user !== "string" ? driver.user._id : driver.user;
    const patchLoads = [...driver.loads, ...additionalLoads];
    await patchDriverLoads(_id, patchLoads);
    setAdditionalLoads([]);
    setLoadDialog(false);
  };

  const handleDeleteLoad = async (load_id) => {
    const _id = typeof driver.user !== "string" ? driver.user._id : driver.user;
    await deleteDriverLoads(_id, load_id);
  };
  const handleDeleteDriver = async () => {
    const _id = typeof driver.user !== "string" ? driver.user._id : driver.user;
    await deleteDriver(_id);
  };

  return (
    <>
      <TableBody>
        <TableRow>
          <TableCell>
            {/* TODO: make the collapsable button only work when there is a load */}
            {/* <IconButton
              aria-label="expand row"
              size="small"
              disabled={loads.length === 0}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton> */}
          </TableCell>
          <TableCell align="center">{driver.firstName}</TableCell>
          <TableCell align="center">{driver.lastName}</TableCell>
          <TableCell align="center">{driver.phoneNumber}</TableCell>
          {/* <TableCell align="center">
            { (user && user.role === 'afterhours') || <IconButton
              aria-label="add load"
              onClick={() => {
                setLoadDialog(true);
              }}
              disabled={addLoadsButtonDisabled}
            >
              <AddBoxIcon color="primary" fontSize="large" />
            </IconButton> }
          </TableCell> */}
          <TableCell>
            {(user && user.role === "afterhours") || (
              <IconButton onClick={handleDeleteDriver}>
                <DeleteIcon style={{ color: "rgb(220, 0, 78)" }} />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Assigned Loads
                </Typography>
                <Table size="small" aria-label="assigned loads">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Load Number </TableCell>
                      <TableCell align="center">Number of Pickups</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {driver.loads.map((load, index) => (
                      <TableRow key={load._id}>
                        <TableCell component="th" scope="row" align="center">
                          {load.loadNumber}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {load.pickup.length}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {(user && user.role === "afterhours") || (
                            <IconButton
                              onClick={() => {
                                handleDeleteLoad(load._id);
                              }}
                            >
                              <DeleteIcon
                                style={{ color: "rgb(220, 0, 78)" }}
                              />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </TableBody>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={loadDialog}
        onClose={() => setLoadDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Load to Driver</DialogTitle>
        <DialogContent>
          <div className="form-group">
            <InputLabel id="assignLoadsLabel">
              Assign Additional Loads
            </InputLabel>
            <Select
              labelId="assignedLoadsLabel"
              id="assignedLoads"
              multiple
              value={additionalLoads}
              style={{ width: "350px" }}
              onChange={handleLoadsChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip
                      key={value._id}
                      label={value.loadNumber}
                      className={classes.chip}
                    />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {filteredLoads.map((load) => (
                <MenuItem
                  key={load._id}
                  value={load}
                  style={getStyles(load, filteredLoads, theme)}
                >
                  Load Number: {load.loadNumber}, Number of Pickups:{" "}
                  {load.pickup.length}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Button className="" onClick={onPatch} style={{ marginTop: "20px" }}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

DriverItem.propTypes = {
  driver: PropTypes.object.isRequired,
  getLoads: PropTypes.func.isRequired,
  patchDriverLoads: PropTypes.func.isRequired,
  deleteDriverLoads: PropTypes.func.isRequired,
  deleteDriver: PropTypes.func.isRequired,
};

const mapStateToProps = ({ load, auth: { user } }) => ({ load, user });

export default connect(mapStateToProps, {
  patchDriverLoads,
  getLoads,
  deleteDriverLoads,
  deleteDriver,
})(DriverItem);
