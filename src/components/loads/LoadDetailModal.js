import React, { Fragment, useEffect, useRef } from "react";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ArrowForward from "@material-ui/icons/ArrowForward";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { addLoad, updateLoad } from "../../actions/load";
import moment from "moment";
import { getDrivers } from "../../actions/driver";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DeleteIcon from "@material-ui/icons/Delete";
import "./style.css";
import { FileCopyOutlined } from "@material-ui/icons";
import { changeObjectKey } from "../../utils/helper";
import { useStyles } from "./styles";

const verticalAlignStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const formInitialState = {
  status: "",
  rate: "",
  assignedTo: null,
  trailorNumber: "",
  rateConfirmation: null,
  proofDelivery: null,
  accessorials: [],
  pickup: [],
  drop: [],
  invoice_created: false,
};

const TextPlaceHolder = ({ value }) => (value ? value : "--");

const LoadDetailModal = ({
  deleteLoad,
  modalEdit,
  open,
  handleClose,
  listBarType,
  load,
}) => {
  let {
    _id,
    brokerage,
    loadNumber,
    rate,
    trailorNumber,
    pickup,
    drop,
    assignedTo = null,
    user,
    status = "",
    accessorials = [],
    invoice_created,
    bucketFiles = [],
  } = load || {};
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [edit, setEdit] = React.useState(false);
  const [form, setForm] = React.useState({ ...formInitialState });
  const rateConfirmationRef = useRef();
  const proofDeliveryRef = useRef();
  useEffect(() => {
    setupDrivers();
    setForm({
      status,
      assignedTo: user,
      accessorials,
      trailorNumber,
      pickup,
      drop,
      rate,
      loadNumber,
      invoice_created,
    });
    resetFileInputs();
  }, []);
  useEffect(() => {
    const drivers = state.driver.drivers;
    if (drivers.length > 0) {
      // console.log(user._id, state.driver.drivers);
      // setForm({ ...form, assignedTo: user });
      // for (let driver of drivers) {
      //     if (driver.loads.length > 0) {
      //         for (let load of driver.loads) {
      //             if (load._id === _id) {
      //                 setForm({ ...form, assignedTo: user._id });
      //             }
      //         }
      //     }
      // }
    }
  }, [state.driver.drivers]);
  useEffect(() => {
    const error = state.load.error;
    if (!error.msg) {
      setEdit(false);
      handleClose();
    }
  }, [state.load.error]);
  useEffect(() => {
    if (modalEdit) setEdit(true);
  }, [modalEdit]);
  useEffect(() => {
    if (!state.load.load) {
      handleClose();
    }
  }, [state.load.load]);
  const setupDrivers = () => {
    dispatch(getDrivers());
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.status !== "Delivered") {
      form.invoice_created = false;
    }
    dispatch(updateLoad({ ...form, _id }, listBarType));
    // resetFileInputs();
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };
  const handlePickDropChange = (
    { target: { value } },
    keyToUpdate,
    childKey
  ) => {
    if (keyToUpdate === "pickup")
      setForm({ ...form, pickup: [{ ...form.pickup[0], [childKey]: value }] });
    else if (keyToUpdate === "drop")
      setForm({ ...form, drop: [{ ...form.drop[0], [childKey]: value }] });
  };
  const handleCancel = () => {
    setForm({ ...form, assignedTo: user, status, accessorials, pickup, drop });
    setEdit(false);
    resetFileInputs();
  };
  const handleDateChange = (date, key) => {
    setForm({ ...form, [key]: [{ ...form[key][0], [`${key}Date`]: date }] });
  };
  const handleFileChange = ({ target: { name, files } }) => {
    setForm((f) => ({ ...f, [name]: files || null }));
  };
  const resetFileInputs = () => {
    if (rateConfirmationRef.current) rateConfirmationRef.current.value = "";
    if (proofDeliveryRef.current) proofDeliveryRef.current.value = "";
  };
  const handleInOutTime = (date, parent_key, child_key) => {
    // parent_key: drop || pickup
    // child_key: in_time || out_time
    setForm((form) => ({
      ...form,
      [parent_key]: [{ ...form[parent_key][0], [child_key]: date }],
    }));
  };
  const getRole = () => {
    try {
      const {
        auth: {
          user: { role },
        },
      } = state;
      return role;
    } catch (e) {
      return "";
    }
  };

  const createCopy = () => {
    let body = { ...load };
    body = changeObjectKey(body, "pickup", "pickUp");
    body = changeObjectKey(body, "drop", "dropOff");
    dispatch(addLoad(body));
  };

  if (bucketFiles.length) {
    const alpha = [...bucketFiles];
    bucketFiles = {};
    alpha.forEach((item = {}) => {
      const { fileType = "", fileLocation = "" } = item;
      Object.assign(bucketFiles, { [fileType]: fileLocation });
    });
  } else bucketFiles = {};

  const { rateConfirmation = "", proofDelivery = "" } = bucketFiles || {};

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="server-modal-title"
      >
        <div className={classes.paper}>
          <DeleteIcon
            onClick={(e) => deleteLoad(_id, e)}
            style={{ color: "rgb(220, 0, 78)", cursor: "pointer" }}
          />
          <CloseIcon
            id="server-modal-title"
            onClick={handleClose}
            style={{
              color: "black",
              marginTop: "13%",
              height: 50,
              cursor: "pointer",
              float: "right",
              marginTop: "5px",
              width: "20px",
            }}
          />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} className={classes.rootLoadDetailModal}>
              <Grid item xs={4}>
                <Grid container className={classes.rootLoadDetailModal}>
                  <Grid xs={2}>
                    <p style={{ fontSize: 16 }}>Status:</p>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      style={{ width: "100%" }}
                    >
                      <Select
                        style={{ height: 35, width: "100%" }}
                        size="small"
                        id="demo-simple-select-outlined"
                        value={form.status}
                        name="status"
                        disabled={!edit || state.auth.user.role === "driver"}
                        onChange={handleOnChange}
                      >
                        <MenuItem value={"Loading"}>Loading</MenuItem>
                        <MenuItem value={"Unloading"}>Unloading</MenuItem>
                        <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                        <MenuItem value={"Picked Up"}>Picked up</MenuItem>
                        <MenuItem value={"Delivered"}>Delivered</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container className={classes.rootLoadDetailModal}>
                  <Grid xs={3}>
                    <p style={{ fontSize: 16 }}>Assigned:</p>
                  </Grid>
                  <Grid item xs={7}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      style={{ width: "100%" }}
                    >
                      <Select
                        style={{ height: 35 }}
                        id="demo-simple-select-outlined"
                        name="assignedTo"
                        disabled={!edit || state.auth.user.role === "driver"}
                        value={form.assignedTo}
                        onChange={handleOnChange}
                      >
                        {state.driver.drivers.map(
                          ({ user, firstName, lastName }, index) => (
                            <MenuItem
                              value={user && user._id ? user._id : null}
                              key={index}
                            >
                              {user && user._id
                                ? `${firstName} ${lastName}`
                                : "Invalid Driver"}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container className={classes.rootLoadDetailModal}>
                  <Grid xs={3}>
                    <p style={{ fontSize: 16 }}>Accessorials:</p>
                  </Grid>
                  <Grid item xs={7}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      style={{ width: "100%" }}
                    >
                      <Select
                        style={{ height: 35 }}
                        id="demo-simple-select-outlined"
                        name="accessorials"
                        value={form.accessorials}
                        disabled={!edit || state.auth.user.role === "driver"}
                        multiple
                        onChange={handleOnChange}
                      >
                        <MenuItem value={"TONU"}>TONU</MenuItem>
                        <MenuItem value={"Detention"}>Detention</MenuItem>
                        <MenuItem value={"Lumper"}>Lumper</MenuItem>
                        <MenuItem value={"Lumper-by-Broker"}>
                          Lumper by Broker
                        </MenuItem>
                        <MenuItem value={"Lumper-by-Carrier"}>
                          Lumper by Carrier
                        </MenuItem>
                        <MenuItem value={"Layover"}>Layover</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.rootLoadDetailModal}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <Grid container className={classes.rootLoadDetailModal}>
                  <Grid item xs={3}>
                    <p>Trailor #</p>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      size="small"
                      disabled={!edit || state.auth.user.role === "driver"}
                      id="outlined-basic"
                      variant="outlined"
                      label="Trailer #"
                      name="trailorNumber"
                      value={form.trailorNumber}
                      onChange={handleOnChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              className={classes.rootLoadDetailModal}
              style={{ marginTop: 10 }}
            >
              <Grid item xs={1}></Grid>
              <Grid item xs={4} style={{ textAlign: "center" }}>
                <h3>Pickup</h3>
                <p>
                  {edit && state.auth.user.role !== "driver" ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Shipper Name"
                      value={form.pickup[0] ? form.pickup[0].shipperName : ""}
                      onChange={(event) =>
                        handlePickDropChange(event, "pickup", "shipperName")
                      }
                    />
                  ) : (
                    <TextPlaceHolder
                      value={pickup && pickup[0] ? pickup[0].shipperName : ""}
                    />
                  )}
                </p>
                <p>
                  {edit && state.auth.user.role !== "driver" ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Address"
                      value={form.pickup[0] ? form.pickup[0].pickupAddress : ""}
                      onChange={(event) =>
                        handlePickDropChange(event, "pickup", "pickupAddress")
                      }
                    />
                  ) : (
                    <TextPlaceHolder
                      value={pickup && pickup[0] ? pickup[0].pickupAddress : ""}
                    />
                  )}
                </p>
                <p>
                  {edit && state.auth.user.role !== "driver" ? (
                    <Grid
                      container
                      spacing={2}
                      className={classes.rootLoadDetailModal}
                    >
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label="City"
                          value={
                            form.pickup[0] ? form.pickup[0].pickupCity : ""
                          }
                          onChange={(event) =>
                            handlePickDropChange(event, "pickup", "pickupCity")
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label="State"
                          value={
                            form.pickup[0] ? form.pickup[0].pickupState : ""
                          }
                          onChange={(event) =>
                            handlePickDropChange(event, "pickup", "pickupState")
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label="Zip"
                          value={form.pickup[0] ? form.pickup[0].pickupZip : ""}
                          onChange={(event) =>
                            handlePickDropChange(event, "pickup", "pickupZip")
                          }
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <TextPlaceHolder
                        value={pickup && pickup[0] ? pickup[0].pickupCity : ""}
                      />
                      ,
                      <TextPlaceHolder
                        value={pickup && pickup[0] ? pickup[0].pickupState : ""}
                      />
                      ,
                      <TextPlaceHolder
                        value={pickup && pickup[0] ? pickup[0].pickupZip : ""}
                      />
                    </>
                  )}
                </p>
                <p>
                  <h3>Pickup Time</h3>
                  {edit && state.auth.user.role !== "driver" ? (
                    <Grid container>
                      <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="time-picker"
                            value={
                              form.pickup[0] ? form.pickup[0].pickupDate : ""
                            }
                            onChange={(date) =>
                              handleDateChange(date, "pickup")
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="date-picker-dialog"
                            format="MM/dd/yyyy"
                            value={
                              form.pickup[0] ? form.pickup[0].pickupDate : ""
                            }
                            onChange={(date) =>
                              handleDateChange(date, "pickup")
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                    </Grid>
                  ) : pickup && pickup[0] ? (
                    moment(pickup[0].pickupDate).format("LLL")
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  <Grid container>
                    <Grid item xs={6}>
                      {edit ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            label="In Time"
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="time-picker"
                            value={form.pickup[0] ? form.pickup[0].in_time : ""}
                            onChange={(date) =>
                              handleInOutTime(date, "pickup", "in_time")
                            }
                          />
                        </MuiPickersUtilsProvider>
                      ) : pickup && pickup[0] && pickup[0].in_time ? (
                        "In time: " + moment(pickup[0].in_time).format("h:mm A")
                      ) : (
                        "--"
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      {edit ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            label="Out Time"
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="time-picker"
                            value={
                              form.pickup[0] ? form.pickup[0].out_time : ""
                            }
                            onChange={(date) =>
                              handleInOutTime(date, "pickup", "out_time")
                            }
                          />
                        </MuiPickersUtilsProvider>
                      ) : pickup && pickup[0] && pickup[0].out_time ? (
                        "Out time: " +
                        moment(pickup[0].out_time).format("h:mm A")
                      ) : (
                        "--"
                      )}
                    </Grid>
                  </Grid>
                </p>
              </Grid>
              <Grid item xs={2}>
                <ArrowForward
                  style={{
                    color: "black",
                    marginTop: "13%",
                    height: 50,
                    width: 50,
                  }}
                />
              </Grid>
              <Grid item xs={4} style={{ textAlign: "center" }}>
                <h3>Drop</h3>
                <p>
                  {edit && state.auth.user.role !== "driver" ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Receiver Name"
                      value={form.drop[0] ? form.drop[0].receiverName : ""}
                      onChange={(event) =>
                        handlePickDropChange(event, "drop", "receiverName")
                      }
                    />
                  ) : (
                    <TextPlaceHolder
                      value={drop && drop[0] ? drop[0].receiverName : ""}
                    />
                  )}
                </p>
                <p>
                  {edit && state.auth.user.role !== "driver" ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Address"
                      value={form.drop[0] ? form.drop[0].dropAddress : ""}
                      onChange={(event) =>
                        handlePickDropChange(event, "drop", "dropAddress")
                      }
                    />
                  ) : (
                    <TextPlaceHolder
                      value={drop && drop[0] ? drop[0].dropAddress : ""}
                    />
                  )}
                </p>
                <p>
                  {edit && state.auth.user.role !== "driver" ? (
                    <Grid
                      container
                      spacing={2}
                      className={classes.rootLoadDetailModal}
                    >
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label="City"
                          value={form.drop[0] ? form.drop[0].dropCity : ""}
                          onChange={(event) =>
                            handlePickDropChange(event, "drop", "dropCity")
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label="State"
                          value={form.drop[0] ? form.drop[0].dropState : ""}
                          onChange={(event) =>
                            handlePickDropChange(event, "drop", "dropState")
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label="Zip"
                          value={form.drop[0] ? form.drop[0].dropZip : ""}
                          onChange={(event) =>
                            handlePickDropChange(event, "drop", "dropZip")
                          }
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <TextPlaceHolder
                        value={drop && drop[0] ? drop[0].dropCity : ""}
                      />
                      ,
                      <TextPlaceHolder
                        value={drop && drop[0] ? drop[0].dropState : ""}
                      />
                      ,
                      <TextPlaceHolder
                        value={drop && drop[0] ? drop[0].dropZip : ""}
                      />
                    </>
                  )}
                </p>
                <p>
                  <h3>Delivery Time</h3>
                  {edit && state.auth.user.role !== "driver" ? (
                    <Grid container>
                      <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="time-picker"
                            value={form.drop[0] ? form.drop[0].dropDate : ""}
                            onChange={(date) => handleDateChange(date, "drop")}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="date-picker-dialog"
                            format="MM/dd/yyyy"
                            value={form.drop[0] ? form.drop[0].dropDate : ""}
                            onChange={(date) => handleDateChange(date, "drop")}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                    </Grid>
                  ) : drop && drop[0] ? (
                    moment(drop[0].dropDate).format("LLL")
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  <Grid container>
                    <Grid item xs={6}>
                      {edit ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            label="In Time"
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="time-picker"
                            value={form.drop[0] ? form.drop[0].in_time : ""}
                            onChange={(date) =>
                              handleInOutTime(date, "drop", "in_time")
                            }
                          />
                        </MuiPickersUtilsProvider>
                      ) : drop && drop[0] && drop[0].in_time ? (
                        "In time: " + moment(drop[0].in_time).format("h:mm A")
                      ) : (
                        "--"
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      {edit ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            label="Out Time"
                            className={classes.textFieldDialog}
                            InputProps={{
                              classes: { input: classes.resizeDialog },
                            }}
                            size="small"
                            id="time-picker"
                            value={form.drop[0] ? form.drop[0].out_time : ""}
                            onChange={(date) =>
                              handleInOutTime(date, "drop", "out_time")
                            }
                          />
                        </MuiPickersUtilsProvider>
                      ) : drop && drop[0] && drop[0].out_time ? (
                        "Out time: " + moment(drop[0].out_time).format("h:mm A")
                      ) : (
                        "--"
                      )}
                    </Grid>
                  </Grid>
                </p>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid container spacing={2} className={classes.rootLoadDetailModal}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4} style={{ textAlign: "center" }}>
                {!edit ? (
                  <p style={{ fontSize: 20 }}>
                    <b>Load</b> {loadNumber ? loadNumber : "--"}
                  </p>
                ) : getRole() &&
                  (getRole() === "admin" || getRole() === "dispatch") ? (
                  <TextField
                    style={{ marginBottom: "5%" }}
                    id="outlined-basic"
                    variant="outlined"
                    label="Load #"
                    name="loadNumber"
                    value={form.loadNumber}
                    onChange={handleOnChange}
                  />
                ) : (
                  ""
                )}

                {!edit ? (
                  <p style={{ fontSize: 20 }}>
                    <b>Rate</b> {rate ? rate : "--"}
                  </p>
                ) : // <p><b>Rate</b> { rate ? rate : '--' }</p> :
                getRole() &&
                  (getRole() === "admin" || getRole() === "dispatch") ? (
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Rate"
                    name="rate"
                    value={form.rate}
                    onChange={handleOnChange}
                  />
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
            <Grid container spacing={2} className={classes.rootLoadDetailModal}>
              <Grid item xs={1}></Grid>
              <Grid item xs={4} style={{ textAlign: "left" }}>
                <p>
                  Pickup Reference#{" "}
                  {pickup && pickup[0] ? pickup[0].pickupReference : ""}
                </p>
                <p>PO# {pickup && pickup[0] ? pickup[0].pickupPo : ""}</p>
                <p>
                  Pickup delivery#{" "}
                  {pickup && pickup[0] ? pickup[0].pickupDeliverNumber : ""}
                </p>

                {/* <p>PO Ref# {pickup && pickup[0] ? pickup[0].pickupReference : ''}</p> */}

                {!edit ? (
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        pickup && pickup[0]
                          ? "Notes: " +
                            pickup[0].notes.replace(/(.{15})/g, "$1<br>")
                          : "Notes:",
                    }}
                  ></p>
                ) : state.auth.user.role !== "driver" ? (
                  <TextField
                    id="outlined-multiline-static"
                    label="Pickup Notes"
                    multiline
                    rows={2}
                    value={form.pickup[0] ? form.pickup[0].notes : ""}
                    onChange={(event) =>
                      handlePickDropChange(event, "pickup", "notes")
                    }
                    variant="outlined"
                  />
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={4} style={{ textAlign: "left" }}>
                <p>
                  Drop Reference# {drop && drop[0] ? drop[0].dropReference : ""}
                </p>
                <p>
                  Deliver# {drop && drop[0] ? drop[0].dropDeliverNumber : ""}
                </p>
                <p>Drop PO# {drop && drop[0] ? drop[0].dropPo : ""}</p>

                {/* <p>Deliver Ref#  {drop && drop[0] ? drop[0].dropReference : ''}</p> */}

                {!edit ? (
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        drop && drop[0]
                          ? "Notes: " +
                            drop[0].notes.replace(/(.{15})/g, "$1<br>")
                          : "Notes:",
                    }}
                  ></p>
                ) : state.auth.user.role !== "driver" ? (
                  <TextField
                    id="outlined-multiline-static"
                    label="Drop Notes"
                    multiline
                    rows={2}
                    value={form.drop[0] ? form.drop[0].notes : ""}
                    onChange={(event) =>
                      handlePickDropChange(event, "drop", "notes")
                    }
                    variant="outlined"
                  />
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              className={classes.rootLoadDetailModal}
              style={{ height: "100px" }}
            >
              <Grid item xs={4} style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {!edit ? (
                    <Fragment>
                      <IconButton>
                        <EditIcon
                          fontSize="large"
                          color="primary"
                          onClick={() => setEdit(true)}
                        />
                      </IconButton>
                      <IconButton>
                        <FileCopyOutlined
                          fontSize="large"
                          color="primary"
                          onClick={createCopy}
                        />
                      </IconButton>
                    </Fragment>
                  ) : (
                    <>
                      <IconButton>
                        <DoneIcon
                          fontSize="large"
                          color="primary"
                          onClick={handleSubmit}
                        />
                      </IconButton>
                      <IconButton>
                        <CloseIcon
                          fontSize="large"
                          color="primary"
                          onClick={() => handleCancel()}
                        />
                      </IconButton>
                    </>
                  )}
                </div>
              </Grid>
              <Grid
                item
                xs={4}
                style={{ textAlign: "center", position: "relative" }}
              >
                {edit ? (
                  <div style={verticalAlignStyle}>
                    <Grid container style={{ margin: "10px" }}>
                      <Grid item xs={6} style={{ textAlign: "left" }}>
                        <label>Rate Confirmation</label>
                      </Grid>
                      <Grid item xs={6}>
                        <input
                          type="file"
                          multiple
                          name="rateConfirmation"
                          disabled={!edit || state.auth.user.role === "driver"}
                          onChange={handleFileChange}
                          ref={rateConfirmationRef}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ margin: "10px" }}>
                      <Grid item xs={6} style={{ textAlign: "left" }}>
                        <label>Proof of Address</label>
                      </Grid>
                      <Grid item xs={6}>
                        <input
                          type="file"
                          multiple
                          name="proofDelivery"
                          disabled={!edit}
                          onChange={handleFileChange}
                          ref={proofDeliveryRef}
                        />
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <div style={verticalAlignStyle}>
                    {/* <p style={{margin: 0}}>Echo Global Logisitcs</p>
                                <p style={{margin: 0}}>Rep: William Penske</p>
                                <p style={{margin: 0}}>618-501-2250</p>
                                <p style={{margin: 0}}>wpenske@echo.com</p> */}
                  </div>
                )}
              </Grid>
              <Grid item xs={4} style={{ position: "relative" }}>
                <div
                  className="load-checklist"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "80%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    {rateConfirmation ? (
                      <span>
                        <a href={rateConfirmation} target="_blank">
                          Rate Confirmation
                        </a>
                      </span>
                    ) : (
                      <span>Rate Confirmation</span>
                    )}
                    <span>
                      {rateConfirmation ? (
                        <CheckCircleIcon style={{ color: "green" }} />
                      ) : (
                        <CancelIcon style={{ color: "red" }} />
                      )}
                    </span>
                  </p>
                  <p style={{ margin: 0 }}>
                    {proofDelivery ? (
                      <span>
                        <a href={rateConfirmation} target="_blank">
                          Proof of Delivery
                        </a>
                      </span>
                    ) : (
                      <span>Proof of Delivery</span>
                    )}
                    <span>
                      {proofDelivery ? (
                        <CheckCircleIcon style={{ color: "green" }} />
                      ) : (
                        <CancelIcon style={{ color: "red" }} />
                      )}
                    </span>
                  </p>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default LoadDetailModal;
