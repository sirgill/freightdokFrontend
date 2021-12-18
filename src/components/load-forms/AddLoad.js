import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import {
  CssTextField,
  TextFieldHelper,
  CSSDatePicker,
  CSSTimePicker,
  useStyles,
} from "../HelperCells";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addLoad } from "../../actions/load";
import AsyncAutoComplete from "../Atoms/AsyncAutoComplete";
import _ from "lodash";

const AddLoadForm = ({ addLoad, user }) => {
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
      {(user && user.role === "afterhours") || (
        <Fab
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20%" }}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <div className="">
            <form className={classes.form}>
              {count === 1 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Add Load</DialogTitle>
                  <TextFieldHelper
                    nameNType={"brokerage"}
                    label={"Brokerage"}
                    onChange={(e) => updateForm(e)}
                    value={brokerage}
                  />
                  <TextFieldHelper
                    nameNType={"loadNumber"}
                    label={"Load Number"}
                    onChange={(e) => updateForm(e)}
                    value={loadNumber}
                  />
                  <TextFieldHelper
                    nameNType={"rate"}
                    label={"Rate"}
                    onChange={(e) => updateForm(e)}
                    value={rate}
                  />
                </div>
              ) : null}

              {count === 2 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Pickup</DialogTitle>
                  <TextFieldHelper
                    nameNType={"shipperName"}
                    label={"Shipper"}
                    onChange={updatePickUp}
                    value={pickUp.shipperName}
                  />
                  <div className="form-group">
                    <AsyncAutoComplete
                      name="pickupAddress"
                      label={"Address"}
                      value={pickUp.pickupAddress}
                      getOptionLabelKey="address"
                      handleChange={({ name, value = {} }) => {
                        if (_.isObject(value)) {
                          const {
                            address = pickUp.pickupAddress,
                            city = pickUp.pickupCity,
                            zip = pickUp.pickupZip,
                            state = pickUp.pickupState,
                            name: shipperName = pickUp.name,
                          } = value;
                          setPickup({
                            ...pickUp,
                            shipperName: shipperName,
                            [name]: address,
                            pickupCity: city,
                            pickupState: state,
                            pickupZip: zip,
                          });
                        } else {
                          setPickup({ ...pickUp, [name]: value });
                        }
                      }}
                    />
                  </div>
                  <TextFieldHelper
                    nameNType={"pickupCity"}
                    label={"City"}
                    onChange={updatePickUp}
                    value={pickUp.pickupCity}
                  />
                  <TextFieldHelper
                    nameNType={"pickupState"}
                    label={"State"}
                    onChange={updatePickUp}
                    value={pickUp.pickupState}
                  />
                  <TextFieldHelper
                    nameNType={"pickupZip"}
                    label={"Zip"}
                    onChange={updatePickUp}
                    value={pickUp.pickupZip}
                  />
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
                  <TextFieldHelper
                    nameNType={"pickupPo"}
                    label={"PO#"}
                    onChange={(e) => updatePickUp(e)}
                    value={pickUp.pickupPo}
                  />
                  <TextFieldHelper
                    nameNType={"pickupDeliverNumber"}
                    label={"Delivery#"}
                    onChange={(e) => updatePickUp(e)}
                    value={pickUp.pickupDeliverNumber}
                  />
                  <TextFieldHelper
                    nameNType={"pickupReference"}
                    label={"Ref#"}
                    onChange={(e) => updatePickUp(e)}
                    value={pickUp.pickupReference}
                  />
                </div>
              ) : null}

              {count === 4 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Drop</DialogTitle>

                  <div className="form-group">
                    <CssTextField
                      name="receiverName"
                      label={"Receiver"}
                      value={dropOff.receiverName}
                      handleChange={updateDropOff}
                    />
                  </div>

                  <div className="form-group">
                    <AsyncAutoComplete
                      name="dropAddress"
                      label={"Address"}
                      value={pickUp.dropAddress}
                      getOptionLabelKey="address"
                      handleChange={({ name, value = {} }) => {
                        if (_.isObject(value)) {
                          const {
                            address = dropOff.dropAddress,
                            city = dropOff.dropCity,
                            zip = dropOff.dropZip,
                            state = dropOff.dropState,
                            name: receiverName = dropOff.receiverName,
                          } = value;
                          setDropOff({
                            ...dropOff,
                            receiverName,
                            [name]: address,
                            dropCity: city,
                            dropState: state,
                            dropZip: zip,
                          });
                        } else {
                          setDropOff({ ...dropOff, [name]: value });
                        }
                      }}
                    />
                  </div>
                  <TextFieldHelper
                    nameNType={"dropCity"}
                    label={"City"}
                    onChange={(e) => updateDropOff(e)}
                    value={dropOff.dropCity}
                  />
                  <TextFieldHelper
                    nameNType={"dropState"}
                    label={"State"}
                    onChange={(e) => updateDropOff(e)}
                    value={dropOff.dropState}
                  />
                  <TextFieldHelper
                    nameNType={"dropZip"}
                    label={"Zip"}
                    onChange={(e) => updateDropOff(e)}
                    value={dropOff.dropZip}
                  />
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
                  <TextFieldHelper
                    nameNType={"dropPo"}
                    label={"PO#"}
                    onChange={(e) => updateDropOff(e)}
                    value={dropOff.dropPo}
                  />
                  <TextFieldHelper
                    nameNType={"dropDeliverNumber"}
                    label={"Delivery#"}
                    onChange={(e) => updateDropOff(e)}
                    value={dropOff.dropDeliverNumber}
                  />
                  <TextFieldHelper
                    nameNType={"dropReference"}
                    label={"Ref#"}
                    onChange={(e) => updateDropOff(e)}
                    value={dropOff.dropReference}
                  />
                </div>
              ) : null}
            </form>
          </div>
        </DialogContent>

        <DialogContent></DialogContent>

        <DialogActions></DialogActions>

        <div className={classes.outside}>
          {count !== 1 && (
            <div className={classes.bottomLeft}>
              <ArrowBack
                style={{
                  color: "#1891FC",
                  marginTop: "13%",
                  height: 25,
                  width: 25,
                  cursor: "pointer",
                }}
                onClick={handleBack}
              />
            </div>
          )}
          {count !== 5 && (
            <div className={classes.bottomRight}>
              <ArrowForward
                style={{
                  color: "#1891FC",
                  marginTop: "13%",
                  height: 25,
                  width: 25,
                  cursor: "pointer",
                }}
                onClick={handleNext}
              />
            </div>
          )}

          {count === 5 && (
            <div style={{ textAlign: "center", justifyItems: "center" }}>
              <Grid
                item
                xs={12}
                style={{ marginBottom: "10px", display: "flex" }}
              >
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                  <Button
                    className=""
                    type="submit"
                    variant="outlined"
                    color="primary"
                    onClick={onSubmit}
                  >
                    Submit Load
                  </Button>
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

AddLoadForm.propTypes = {
  addLoad: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { addLoad })(AddLoadForm);
