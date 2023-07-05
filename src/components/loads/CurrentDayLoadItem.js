import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { patchPickup, patchDrop, getLoads } from "../../actions/load";
import LoadDetailModal from "./LoadDetailModal";
import { useStyles } from "./styles";

const CurrentDayLoadItem = ({
  load,
  patchPickup,
  patchDrop,
  getLoads,
  load_id,
}) => {
  const classes = useStyles();
  const { loadNumber, pickup, drop } = load;
  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(false);
  const [firstPickup, setFirstPickup] = useState(pickup[0]);
  const copyFirstPickup = { ...pickup[0] };
  const [firstDrop, setFirstDrop] = useState(drop[0]);
  const currentDate = new Date();
  const pickupDateFormat = new Date(copyFirstPickup.pickupDate);

  const match =
    currentDate.getMonth() === pickupDateFormat.getMonth() &&
    currentDate.getDate() === pickupDateFormat.getDate() &&
    currentDate.getFullYear() === pickupDateFormat.getFullYear();

  const handlePatch = async () => {
    setEditing(false);
    await patchPickup(load_id, firstPickup);
    await patchDrop(load_id, firstDrop);
    getLoads();
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
  };

  const handleUndoPatch = () => {
    setEditing(false);
    setFirstPickup(pickup[0]);
  };

  const handleEditOn = () => {
    setEditing(true);
  };

  const updatePickup = (e) => {
    if (e.target.name === "pickupZip" && !isNaN(parseInt(e.target.value))) {
      setFirstPickup({
        ...firstPickup,
        [e.target.name]: parseInt(e.target.value),
      });
    } else if (e.target.name !== "pickupZip") {
      setFirstPickup({
        ...firstPickup,
        [e.target.name]: e.target.value,
      });
    }
  };

  const updateDrop = (e) => {
    if (e.target.name === "dropZip" && !isNaN(parseInt(e.target.value))) {
      setFirstDrop({
        ...firstDrop,
        [e.target.name]: parseInt(e.target.value),
      });
    } else if (e.target.name !== "dropZip") {
      setFirstDrop({
        ...firstDrop,
        [e.target.name]: e.target.value,
      });
    }
  };

  const updateDate = (date, i) => {
    // i = 0 for pickUp, 1 for dropOff
    if (i === 0) {
      setFirstPickup({
        ...firstPickup,
        ["pickupDate"]: date,
      });
    } else if (i === 1) {
      setFirstDrop({
        ...firstDrop,
        ["dropDate"]: date,
      });
    }
  };

  return (
    <div>
      {match ? (
        <>
          <LoadDetailModal
            open={open}
            load={load}
            handleClose={() => {
              setOpen(false);
            }}
          />
          <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={false}
            onClose={handleClose}
          >
            <DialogContent>
              <Grid
                container
                justify="space-around"
                direction="row"
                alignItems="center"
              >
                <Grid item xs={6} alignItems="center">
                  <TextField
                    className={classes.textFieldDialog}
                    id="standard-full-width"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                    }}
                    disabled={true}
                    value={`Load Number: ${loadNumber}`}
                  />
                </Grid>
                <Grid item xs={6}>
                  <IconButton style={{ float: "right" }} onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={6}
                  alignItems="center"
                  style={{ marginTop: "50px" }}
                >
                  <TextField
                    className={classes.textFieldDialog}
                    id="standard-full-width"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      style: { fontWeight: "bold" },
                    }}
                    style={{ marginLeft: "75px" }}
                    disabled={true}
                    value={"Pickup"}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  alignItems="center"
                  style={{ marginTop: "50px" }}
                >
                  <TextField
                    className={classes.textFieldDialog}
                    id="standard-full-width"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      style: { fontWeight: "bold" },
                    }}
                    style={{ marginLeft: "25px" }}
                    disabled={true}
                    value={"Drop"}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="shipperName"
                    name="shipperName"
                    className={classes.textFieldDialogPickup}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                    }}
                    disabled={!editing}
                    size="medium"
                    value={firstPickup.shipperName}
                    onChange={updatePickup}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="receiverName"
                    name="receiverName"
                    className={classes.textFieldDialogDrop}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: {},
                    }}
                    disabled={!editing}
                    size="medium"
                    value={firstDrop.receiverName}
                    onChange={updateDrop}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="pickupAddress"
                    name="pickupAddress"
                    className={classes.textFieldDialogPickup}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: {},
                    }}
                    disabled={!editing}
                    size="medium"
                    value={firstPickup.pickupAddress}
                    onChange={updatePickup}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="dropAddress"
                    name="dropAddress"
                    className={classes.textFieldDialogDrop}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                    }}
                    disabled={!editing}
                    size="medium"
                    value={firstDrop.dropAddress}
                    onChange={updateDrop}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  {!editing && (
                    <TextField
                      type="pickupCityStateZip"
                      name="pickupCityStateZip"
                      className={classes.textFieldDialogPickup}
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: classes.resizeDialog },
                      }}
                      style={{ minWidth: "250px" }}
                      disabled={true}
                      size="medium"
                      value={`${firstPickup.pickupCity}, ${firstPickup.pickupState}, ${firstPickup.pickupZip}`}
                    />
                  )}
                  {editing && (
                    <Grid container style={{ marginLeft: "75px" }}>
                      <Grid item xs={3}>
                        <TextField
                          type="pickupCity"
                          name="pickupCity"
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="medium"
                          value={firstPickup.pickupCity}
                          onChange={updatePickup}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          wrap="wrap"
                          type="pickupState"
                          name="pickupState"
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="medium"
                          value={firstPickup.pickupState}
                          onChange={updatePickup}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          type="pickupZip"
                          name="pickupZip"
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="medium"
                          value={firstPickup.pickupZip}
                          onChange={updatePickup}
                        />
                      </Grid>
                      <Grid item xs={3} />
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={6} alignItems="center">
                  {!editing && (
                    <TextField
                      type="dropCityStateZip"
                      name="dropCityStateZip"
                      className={classes.textFieldDialogDrop}
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: classes.resizeDialog },
                      }}
                      style={{ minWidth: "250px" }}
                      disabled={true}
                      size="medium"
                      value={`${firstDrop.dropCity}, ${firstDrop.dropState}, ${firstDrop.dropZip}`}
                    />
                  )}
                  {editing && (
                    <Grid container style={{ marginLeft: "25px" }}>
                      <Grid item xs={3}>
                        <TextField
                          type="dropCity"
                          name="dropCity"
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="medium"
                          value={firstDrop.dropCity}
                          onChange={updateDrop}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          type="dropState"
                          name="dropState"
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="medium"
                          value={firstDrop.dropState}
                          onChange={updateDrop}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          type="dropZip"
                          name="dropZip"
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="medium"
                          value={firstDrop.dropZip}
                          onChange={updateDrop}
                        />
                      </Grid>
                      <Grid item xs={3} />
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <Grid container style={{ marginLeft: "75px" }}>
                    <Grid item xs={4}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="small"
                          id="time-picker"
                          value={firstPickup.pickupDate}
                          onChange={(date) => updateDate(date, 0)}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="small"
                          id="date-picker-dialog"
                          format="MM/dd/yyyy"
                          value={firstPickup.pickupDate}
                          onChange={(date) => updateDate(date, 0)}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={4} />
                  </Grid>
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <Grid container style={{ marginLeft: "25px" }}>
                    <Grid item xs={4}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="small"
                          id="time-picker"
                          value={firstDrop.dropDate}
                          onChange={(date) => updateDate(date, 1)}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className={classes.textFieldDialog}
                          InputProps={{
                            disableUnderline: !editing,
                            classes: { input: classes.resizeDialog },
                          }}
                          disabled={!editing}
                          size="small"
                          id="date-picker-dialog"
                          format="MM/dd/yyyy"
                          value={firstDrop.dropDate}
                          onChange={(date) => updateDate(date, 1)}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={4} />
                  </Grid>
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="pickupPo"
                    name="pickupPo"
                    className={classes.textFieldDialogPickup}
                    style={{
                      marginTop: "100px",
                    }}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: { marginLeft: "25px" },
                    }}
                    disabled={!editing}
                    size="medium"
                    label={"PO#"}
                    value={firstPickup.pickupPo}
                    onChange={updatePickup}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="dropPo"
                    name="dropPo"
                    className={classes.textFieldDialogDrop}
                    style={{
                      marginTop: "100px",
                    }}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: { marginLeft: "25px" },
                    }}
                    disabled={!editing}
                    size="medium"
                    label={"PO#"}
                    value={firstDrop.dropPo}
                    onChange={updateDrop}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="pickupDeliverNumber"
                    name="pickupDeliverNumber"
                    className={classes.textFieldDialogPickup}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: { marginLeft: "25px" },
                    }}
                    disabled={!editing}
                    size="medium"
                    label={"Deliver#"}
                    value={firstPickup.pickupDeliverNumber}
                    onChange={updatePickup}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="dropDeliverNumber"
                    name="dropDeliverNumber"
                    className={classes.textFieldDialogDrop}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: { marginLeft: "25px" },
                    }}
                    disabled={!editing}
                    size="medium"
                    label={"Deliver#"}
                    value={firstDrop.dropDeliverNumber}
                    onChange={updateDrop}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="pickupReference"
                    name="pickupReference"
                    className={classes.textFieldDialogPickup}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: { marginLeft: "25px" },
                    }}
                    disabled={!editing}
                    size="medium"
                    label={"Reference"}
                    value={firstPickup.pickupReference}
                    onChange={updatePickup}
                  />
                </Grid>
                <Grid item xs={6} alignItems="center">
                  <TextField
                    type="dropReference"
                    name="dropReference"
                    className={classes.textFieldDialogDrop}
                    InputProps={{
                      disableUnderline: !editing,
                      classes: { input: classes.resizeDialog },
                      style: { marginLeft: "25px" },
                    }}
                    disabled={!editing}
                    size="medium"
                    label={"Reference"}
                    value={firstDrop.dropReference}
                    onChange={updateDrop}
                  />
                </Grid>
                <Grid item xs={6} style={{ marginTop: "50px" }}>
                  {!editing && (
                    <IconButton>
                      <EditIcon
                        fontSize="large"
                        color="primary"
                        onClick={handleEditOn}
                      />
                    </IconButton>
                  )}
                  {editing && (
                    <IconButton>
                      <DoneIcon
                        fontSize="large"
                        color="primary"
                        onClick={handlePatch}
                      />
                    </IconButton>
                  )}
                </Grid>
                <Grid item xs={6} style={{ marginTop: "50px" }}>
                  {editing && (
                    <IconButton>
                      <CloseIcon
                        fontSize="large"
                        color="primary"
                        onClick={handleUndoPatch}
                      />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

CurrentDayLoadItem.propTypes = {
  load: PropTypes.object.isRequired,
  patchPickup: PropTypes.func.isRequired,
  dropPickup: PropTypes.func.isRequired,
  getLoads: PropTypes.func.isRequired,
};

export default connect(null, { patchPickup, patchDrop, getLoads })(
  CurrentDayLoadItem
);
