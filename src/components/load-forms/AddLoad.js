import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import LoadForm from "./LoadNumber";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addLoad } from "../../actions/load";

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#1891FC',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1891FC',
    },
    '& .MuiInput-underline:before': {
      borderColor: '#1891FC'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1891FC',
      },
      '&:hover fieldset': {
        borderColor: '#1891FC',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1891FC',
      },
    },
  },
})(TextField);

const CSSDatePicker = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#1891FC',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1891FC',
    },
    '& .MuiInput-underline:before': {
      borderColor: '#1891FC'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1891FC',
      },
      '&:hover fieldset': {
        borderColor: '#1891FC',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1891FC',
      },
    },
  },
})(KeyboardDatePicker);

const CSSTimePicker = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#1891FC',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1891FC',
    },
    '& .MuiInput-underline:before': {
      borderColor: '#1891FC'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1891FC',
      },
      '&:hover fieldset': {
        borderColor: '#1891FC',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1891FC',
      },
    },
  },
})(KeyboardTimePicker);

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  outside: {
    position: 'relative',
    marginTop: '15%'
  },
  bottomRight: {
    position: 'absolute',
    bottom: '10px',
    right: '10px'
  },
  bottomLeft: {
    position: 'absolute',
    bottom: '10px',
    left: '10px'
  },
}));

const AddLoadForm = ({ addLoad, user }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();

  const formTemplate = {
    brokerage: "",
    loadNumber: "",
    rate: "",
    pickUp: [],
    dropOff: [],
  };

  const pickUpTemplate = {
    shipperName: "",
    pickupAddress: "",
    pickupCity: "",
    pickupState: "",
    pickupZip: "",
    pickupDate: new Date(),
    pickupPo: "",
    pickupDeliverNumber: "",
    pickupReference: "",
  };

  const dropOffTemplate = {
    receiverName: "",
    dropAddress: "",
    dropCity: "",
    dropState: "",
    dropZip: "",
    dropDate: new Date(),
    dropPo: "",
    dropDeliverNumber: "",
    dropReference: "",
  };

  const handleClickOpen = () => {
    setForm(formTemplate);
    setCount(1);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(formTemplate);
    setPickup(pickUpTemplate);
    setDropOff(dropOffTemplate);
    setCount(1);
  };

  const [count, setCount] = React.useState(1);

  const handleNext = () => {
    setCount((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setCount((prevActiveStep) => prevActiveStep - 1);
  };

  const [form, setForm] = useState(formTemplate);

  const [pickUp, setPickup] = useState(pickUpTemplate);

  const [dropOff, setDropOff] = useState(dropOffTemplate);

  const handleNewPickDrop = () => {
    const tempForm = { ...form };

    tempForm.pickUp.push({ ...pickUp });
    tempForm.dropOff.push({ ...dropOff });

    setForm({ ...tempForm });

    setPickup(pickUpTemplate);
    setDropOff(dropOffTemplate);

    setCount(2);
  };

  const { brokerage, loadNumber, rate } = form;

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updatePickUp = (e) => {
    if (e.target.name === "pickupZip" && !isNaN(parseInt(e.target.value))) {
      setPickup({
        ...pickUp,
        [e.target.name]: parseInt(e.target.value),
      });
    } else if (e.target.name !== "pickupZip") {
      setPickup({
        ...pickUp,
        [e.target.name]: e.target.value,
      });
    }
  };

  const updateDate = (date, i) => {
    // i = 0 for pickUp, 1 for dropOff
    if (i === 0) {
      setPickup({
        ...pickUp,
        ["pickupDate"]: date,
      });
    } else if (i === 1) {
      setDropOff({
        ...dropOff,
        ["dropDate"]: date,
      });
    }
  };

  const updateDropOff = (e) => {
    if (e.target.name === "dropZip" && !isNaN(parseInt(e.target.value))) {
      setDropOff({
        ...dropOff,
        [e.target.name]: parseInt(e.target.value),
      });
    } else if (e.target.name !== "dropZip") {
      setDropOff({
        ...dropOff,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleNewPickDrop();

    addLoad(form);

    handleClose();
  };

  return (
    <div>
      {(user && user.role === 'afterhours') || <Fab color="primary" onClick={handleClickOpen} style={{ marginBottom: '20%' }}>
        <AddIcon />
      </Fab>}

      <Dialog fullWidth={true} maxWidth={"sm"} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <div className="">
            <form className={classes.form}>
              {count === 1 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Add Load</DialogTitle>
                  <div className="form-group">
                    <CssTextField
                      id=""
                      type="brokerage"
                      className="form-control"
                      name="brokerage"
                      label="Brokerage"
                      onChange={(e) => updateForm(e)}
                      value={brokerage}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="loadNumber"
                      className="form-control"
                      name="loadNumber"
                      label="Load Number"
                      onChange={(e) => updateForm(e)}
                      value={loadNumber}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="rate"
                      className="form-control"
                      name="rate"
                      label="Rate"
                      onChange={(e) => updateForm(e)}
                      value={rate}
                    />
                  </div>
                </div>
              ) : null}

              {count === 2 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Pickup</DialogTitle>
                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="shipperName"
                      className="form-control"
                      name="shipperName"
                      label="Shipper"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.shipperName}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupAddress"
                      className="form-control"
                      name="pickupAddress"
                      label="Address"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupAddress}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupCity"
                      className="form-control"
                      name="pickupCity"
                      label="City"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupCity}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupState"
                      className="form-control"
                      name="pickupState"
                      label="State"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupState}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupZip"
                      className="form-control"
                      name="pickupZip"
                      label="Zip"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupZip}
                    />
                  </div>

                </div>
              ) : null}

              {count === 3 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Pickup</DialogTitle>
                  <div className="form-group">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <CSSDatePicker
                        style={{ width: 195 }}
                        margin="normal"
                        id="date-picker-dialog"
                        label="Pickup Date"
                        format="MM/dd/yyyy"
                        value={pickUp.pickupDate}
                        onChange={(date) => updateDate(date, 0)}
                      />
                    </MuiPickersUtilsProvider>
                  </div>

                  <div className="form-group">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <CSSTimePicker
                        style={{ width: 195 }}
                        margin="normal"
                        id="time-picker"
                        label="Pickup Time"
                        value={pickUp.pickupDate}
                        onChange={(date) => updateDate(date, 0)}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  {console.log(pickUp)}
                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupPo"
                      className="form-control"
                      name="pickupPo"
                      label="PO#"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupPo}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupDeliverNumber"
                      className="form-control"
                      name="pickupDeliverNumber"
                      label="Delivery#"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupDeliverNumber}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="pickupReference"
                      className="form-control"
                      name="pickupReference"
                      label="Ref#"
                      onChange={(e) => updatePickUp(e)}
                      value={pickUp.pickupReference}
                    />
                  </div>

                </div>
              ) : null}

              {count === 4 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Drop</DialogTitle>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="receiverName"
                      className="form-control"
                      name="receiverName"
                      label="Receiver"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.receiverName}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropAddress"
                      className="form-control"
                      name="dropAddress"
                      label="Address"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropAddress}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropCity"
                      className="form-control"
                      name="dropCity"
                      label="City"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropCity}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropState"
                      className="form-control"
                      name="dropState"
                      label="State"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropState}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropZip"
                      className="form-control"
                      name="dropZip"
                      label="Zip"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropZip}
                    />
                  </div>

                </div>
              ) : null}

              {count === 5 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Drop</DialogTitle>

                  <div className="form-group">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <CSSDatePicker
                        style={{ width: 195 }}
                        margin="normal"
                        id="date-picker-dialog"
                        label="Date"
                        format="MM/dd/yyyy"
                        value={dropOff.dropDate}
                        onChange={(date) => updateDate(date, 1)}
                      />
                    </MuiPickersUtilsProvider>
                  </div>

                  <div className="form-group">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <CSSTimePicker
                        style={{ width: 195 }}
                        margin="normal"
                        id="time-picker"
                        label="Time"
                        value={dropOff.dropDate}
                        onChange={(date) => updateDate(date, 1)}
                      />
                    </MuiPickersUtilsProvider>
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropPo"
                      className="form-control"
                      name="dropPo"
                      label="PO#"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropPo}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropDeliverNumber"
                      className="form-control"
                      name="dropDeliverNumber"
                      label="Delivery#"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropDeliverNumber}
                    />
                  </div>

                  <div className="form-group">
                    <CssTextField
                      id="outlined-basic"
                      type="dropReference"
                      className="form-control"
                      name="dropReference"
                      label="Ref#"
                      onChange={(e) => updateDropOff(e)}
                      value={dropOff.dropReference}
                    />
                  </div>

                </div>
              ) : null}

            </form>

          </div>
        </DialogContent>

        <DialogContent></DialogContent>

        <DialogActions></DialogActions>

        <div className={classes.outside}>
          {count !== 1 && <div className={classes.bottomLeft}>
            <ArrowBack style={{ color: '#1891FC', marginTop: '13%', height: 25, width: 25, cursor: 'pointer' }} onClick={handleBack} />
          </div>}
          {count !== 5 && <div className={classes.bottomRight}>
            <ArrowForward style={{ color: '#1891FC', marginTop: '13%', height: 25, width: 25, cursor: 'pointer' }} onClick={handleNext} />
          </div>}

          {count === 5 && <div style={{ textAlign: 'center', justifyItems: 'center' }}>
            <Grid item xs={12} style={{ marginBottom: "10px", display: 'flex' }}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <Button className="" type="submit" variant="outlined" color="primary" onClick={onSubmit}>
                  Submit Load
                </Button>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </div>}

        </div>
      </Dialog>


    </div>
  );
};

AddLoadForm.propTypes = {
  addLoad: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { addLoad })(AddLoadForm);
