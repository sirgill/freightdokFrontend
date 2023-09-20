import React, { Fragment, useEffect, useRef } from "react";
import _ from 'lodash'
import {
  Divider,
  Grid,
  Stack,
  Typography,
  TextField,
  Box,
  MenuItem,
  Button,
  IconButton,
  Select,
  Modal
} from "@mui/material";
import { ArrowForwardIos as ArrowForwardIosIcon, Close as CloseIcon, Edit as EditIcon, Done as DoneIcon } from '@mui/icons-material'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useDispatch, useSelector } from "react-redux";
import { addLoad, updateLoad } from "../../actions/load";
import moment from "moment";
import { getDrivers } from "../../actions/driver";
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import "./style.css";
import { FileCopyOutlined } from "@mui/icons-material";
import { changeObjectKey } from "../../utils/helper";
import { useStyles } from "./styles";
import InputField from "../Atoms/form/InputField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import DatePicker from '@mui/lab/DatePicker';
import { blue } from "../layout/ui/Theme";
import { getCheckStatusIcon } from "../../utils/utils";


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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TextPlaceHolder = ({ value }) => (value ? value : "--");

const LoadDetailModal = ({
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
  const bktFiles = _.cloneDeep(bucketFiles)
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [edit, setEdit] = React.useState(true);
  const [form, setForm] = React.useState({ ...formInitialState });
  const rateConfirmationRef = useRef();
  const proofDeliveryRef = useRef(),
    SelectElement = edit ? OutlinedInput : FilledInput;
  const assignedToOptions = state.driver.drivers.map(({ user = {} }) => {
    const { name = '', _id = '' } = user || '';
    if (!_id) return {
      name: 'Invalid Driver', _id: ''
    };
    return {
      name, _id
    }
  })

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
      // if(handleClose) handleClose();
    }
  }, [state.load.error]);
  useEffect(() => {
    if (modalEdit) setEdit(true);
  }, [modalEdit]);
  useEffect(() => {
    if (!state.load.load) {
      // if(handleClose) handleClose();
    }
  }, [state.load.load]);
  const setupDrivers = () => {
    dispatch(getDrivers());
  };

  const afterSubmit = (isSuccess) => {
    if(isSuccess) handleClose();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.status !== "Empty") {
      form.invoice_created = false;
    }
    dispatch(updateLoad({ ...form, _id }, listBarType, bktFiles, afterSubmit));
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
    dispatch(addLoad(body, afterSubmit));
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

  const StaticDataShow = ({ heading, values = [], spacing = 2, sxObject = {} }) => {
    return <Stack spacing={spacing} sx={{ ...sxObject }}>
      <Stack><Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>{heading}</Typography></Stack>
      {values.map(value => <Stack>
        <TextPlaceHolder value={value} />
      </Stack>)}
    </Stack>
  }
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="server-modal-title"
      >
        <div className={classes.paper}>
          <Stack direction={'row'} justifyContent={'space-between'} sx={{ mb: 2 }}>
            {/*<DeleteIcon*/}
            {/*    onClick={(e) => deleteLoad(_id, e)}*/}
            {/*    style={{ color: "rgb(220, 0, 78)", cursor: "pointer" }}*/}
            {/*/>*/}
            <IconButton>
              <CloseIcon
                id="server-modal-title"
                onClick={handleClose}
              />
            </IconButton>
          </Stack>
          <form onSubmit={handleSubmit}>

            <Grid container spacing={2} className={classes.rootLoadDetailModal}>
              <Grid item xs={12}>
                <Grid container className={classes.rootLoadDetailModal} spacing={2} sx={{ pl: 3, pr: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <FormControl sx={{ m: 1, minWidth: 225 }} size="small">
                    <InputLabel id="multiple-name">Status</InputLabel>
                      <Select
                          id="multiple-name"
                          name="status"
                          value={form.status}
                          onChange={({ target: { value } }) => setForm({ ...form, status: value, })}
                          input={<SelectElement size='small' label="" notched={false} sx={{ width: 225 }} />}
                          MenuProps={MenuProps}
                          disabled={!edit || state.auth.user.role === "driver"}
                      >
                        {[
                          { id: 'loadCheckIn', label: 'Load Check-In' },
                          { id: 'pickupCompete', label: 'Pickup Complete' },
                          { id: 'arrivedAtDelivery', label: 'Arrived at Delivery' },
                          { id: 'arrivedAtPickup', label: 'Arrived at Pickup' },
                          { id: 'empty', label: 'Delivered' },
                          { id: 'unloadComplete', label: 'Unload Complete' },
                          { id: 'enRoute', label: 'En Route to Delivery' },
                        ].map((name) => (
                            <MenuItem
                                key={name.id}
                                value={name.id}
                                // style={getStyles(name, personName, theme)}
                            >
                              {name.label}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputField
                      label='Assigned'
                      id="assigned-select"
                      name="assignedTo"
                      disabled={!edit || state.auth.user.role === "driver"}
                      value={form.assignedTo}
                      onChange={handleOnChange}
                      type={'select'}
                      options={assignedToOptions}
                      labelKey={'name'}
                      valueKey={'_id'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                    <FormControl sx={{ m: 0, width: 225 }}>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={form.accessorials}
                        onChange={({ target: { value } }) => setForm({ ...form, accessorials: typeof value === 'string' ? value.split(',') : value, })}
                        input={<SelectElement size='small' label="" notched={false} sx={{ width: 225 }} />}
                        MenuProps={MenuProps}
                        disabled={!edit}
                      >
                        {[
                          { id: 'Tonu', label: 'Tonu' },
                          { id: 'Detention', label: 'Detention' },
                          { id: 'Lumper', label: 'Lumper' },
                          { id: 'Lumper-by-Broker', label: 'Lumper by Broker' },
                          { id: 'Lumper-by-Carrier', label: 'Lumper by Carrier' },
                          { id: 'Layover', label: 'Layover' },
                        ].map((name) => (
                          <MenuItem
                            key={name.id}
                            value={name.id}
                          // style={getStyles(name, personName, theme)}
                          >
                            {name.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ m: 2 }}>
                <Divider />
              </Grid>
            </Grid>
            {/********NEW Grid Start***************************************************/}

            <Grid container>
              <Grid item xs={2} sx={{ display: 'flex' }}>
                <Box sx={{ alignItems: 'end', display: 'flex' }}>
                  {edit ? <IconButton onClick={handleSubmit}>
                    <DoneIcon
                      fontSize="large"
                      color="primary"
                    />
                  </IconButton>
                    : <IconButton onClick={() => setEdit(true)} title='Edit'>
                      <EditIcon
                        fontSize="large"
                        color="primary"
                      />
                    </IconButton>}
                  {edit ? <IconButton onClick={handleCancel}>
                    <CloseIcon
                      fontSize="large"
                      color="primary"
                    />
                  </IconButton> : <IconButton onClick={createCopy} title='Create Copy'>
                    <FileCopyOutlined
                      fontSize="large"
                      color="primary"
                    />
                  </IconButton>}
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Grid container>
                  <Grid xs={12} item display={"flex"} justifyContent={'center'}>
                    <Stack>
                      <Stack direction={'row'}>
                        {edit ? getRole() &&
                          (getRole() === "admin" || getRole() === "dispatch") && (
                            <InputField
                              labelStyle={{ fontWeight: 800, fontSize: 18, color: '#03031A' }}
                              id="outlined-basic"
                              name="loadNumber"
                              value={form.loadNumber}
                              onChange={handleOnChange}
                              label={'Load'}
                              direction={'row'}
                            />
                          ) : <Fragment>
                          <Typography sx={{ mr: 1, fontWeight: 600, fontSize: 18 }}>Load</Typography>
                          <Typography item sx={{ fontSize: 18 }}>{loadNumber || '--'}</Typography>
                        </Fragment>}
                      </Stack>
                      <Stack direction='row'>
                        {edit ? getRole() &&
                          (getRole() === "admin" || getRole() === "dispatch") && (
                            <InputField
                              id="outlined-basic"
                              label="Rate"
                              name="rate"
                              value={form.rate}
                              onChange={handleOnChange}
                              direction={'row'}
                              labelStyle={{ fontWeight: 800, fontSize: 18, color: '#03031A' }}
                            />
                          ) : <Fragment>
                          <Typography sx={{ mr: 1, fontWeight: 600, fontSize: 18 }}>Rate</Typography>
                          <Typography item sx={{ fontSize: 18 }}>{rate || '--'}</Typography>
                        </Fragment>}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      {/*CENTER PART*/}
                      <Grid item xs={5}>
                        <Stack sx={{ textAlign: 'center' }}>
                          <Stack>
                            {edit && state.auth.user.role !== "driver" ? (
                              <Stack>
                                <InputField
                                  id="outlined-basic"
                                  placeholder="Shipper Name"
                                  value={form.pickup[0] ? form.pickup[0].shipperName : ""}
                                  onChange={(event) =>
                                    handlePickDropChange(event, "pickup", "shipperName")
                                  }
                                />
                                <InputField
                                  id="outlined-basic"
                                  variant="outlined"
                                  placeholder="Address"
                                  value={form.pickup[0] ? form.pickup[0].pickupAddress : ""}
                                  onChange={(event) =>
                                    handlePickDropChange(event, "pickup", "pickupAddress")
                                  }
                                />
                                {edit && state.auth.user.role !== "driver" && <Fragment>
                                  <InputField
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder="City"
                                    value={
                                      form.pickup[0] ? form.pickup[0].pickupCity : ""
                                    }
                                    onChange={(event) =>
                                      handlePickDropChange(event, "pickup", "pickupCity")
                                    }
                                  />
                                  <InputField
                                    id="outlined-basic"
                                    placeholder="State"
                                    value={
                                      form.pickup[0] ? form.pickup[0].pickupState : ""
                                    }
                                    onChange={(event) =>
                                      handlePickDropChange(event, "pickup", "pickupState")
                                    }
                                  />
                                  <InputField
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder="Zip"
                                    value={form.pickup[0] ? form.pickup[0].pickupZip : ""}
                                    onChange={(event) =>
                                      handlePickDropChange(event, "pickup", "pickupZip")
                                    }
                                  />
                                </Fragment>}
                              </Stack>
                            ) : <StaticDataShow
                              heading={'Pickup'}
                              values={[
                                form.pickup[0] ? form.pickup[0].pickupAddress : "",
                                pickup && pickup[0] ? pickup[0].shipperName : "",
                                `${pickup && pickup[0] ? pickup[0].pickupCity : ""}, ${pickup && pickup[0] ? pickup[0].pickupState : ""}, ${pickup && pickup[0] ? pickup[0].pickupZip : ""}`,
                              ]}
                            />}
                          </Stack>
                          <Stack spacing={2}>
                            {edit ? <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Pickup Time</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    value={
                                      form.pickup[0] ? form.pickup[0].pickupDate : ""
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, "pickup")
                                    }
                                    renderInput={(params) => <TextField {...params} variant='standard' />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <TimePicker
                                    value={
                                      form.pickup[0] ? form.pickup[0].pickupDate : ""
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, "pickup")
                                    }
                                    renderInput={(params) => <TextField {...params} variant='standard' />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <TimePicker
                                    label='In Time'
                                    value={form.pickup[0] ? form.pickup[0].in_time : ""}
                                    onChange={(date) =>
                                      handleInOutTime(date, "pickup", "in_time")
                                    }
                                    renderInput={(params) => <TextField {...params} variant='standard' />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <TimePicker
                                    label='Out Time'
                                    value={
                                      form.pickup[0] ? form.pickup[0].out_time : ""
                                    }
                                    onChange={(date) =>
                                      handleInOutTime(date, "pickup", "out_time")
                                    }
                                    renderInput={(params) => <TextField {...params} variant='standard' />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                              : <Fragment>
                                <StaticDataShow
                                  spacing={2}
                                  sxObject={{ mt: 2 }}
                                  heading={'Pickup Time'}
                                  values={[
                                    pickup && pickup[0] ? (
                                      moment(pickup[0].pickupDate).format("LLL")
                                    ) : (
                                      ""
                                    )
                                  ]}
                                />
                                <Stack direction='row' justifyContent='space-evenly' spacing={2}>
                                  <Stack>
                                    {pickup && pickup[0] && pickup[0].in_time ? (
                                      <Stack sx={{ textAlign: 'left' }}>
                                        <Typography variant='inherit' sx={{ color: '#8898AA', fontSize: 10 }}>In Time: </Typography>
                                        <Box>{moment(pickup[0].in_time).format("h:mm A")}</Box>
                                      </Stack>
                                    ) : (
                                      "--"
                                    )}
                                  </Stack>
                                  <Stack>
                                    {pickup && pickup[0] && pickup[0].out_time ? (
                                      <Stack sx={{ textAlign: 'left' }}>
                                        <Typography variant='inherit' sx={{ color: '#8898AA', fontSize: 10 }}>Out Time:</Typography>
                                        <Box>{moment(pickup[0].out_time).format("h:mm A")}</Box>
                                      </Stack>
                                    ) : (
                                      "--"
                                    )}
                                  </Stack>
                                </Stack>
                              </Fragment>}
                          </Stack>
                          <Stack spacing={2}>
                            <Grid item xs={12} style={{ textAlign: "left", width: '100%' }}>
                              <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                  <Typography fontWeight={700}>PO#</Typography>
                                  {edit ?
                                    <InputField value={pickup && pickup[0] ? pickup[0].pickupPo : ""} />
                                    : <Typography>{pickup && pickup[0] ? pickup[0].pickupPo : ""}</Typography>}
                                </Stack>
                                <Stack direction='row' alignItems={'center'} spacing={1}>
                                  <Typography fontWeight={700}>Reference#</Typography>
                                  {edit ?
                                    <InputField value={pickup && pickup[0] ? pickup[0].pickupReference : ""} />
                                    : <Typography>{pickup && pickup[0] ? pickup[0].pickupReference : ""}</Typography>}
                                </Stack>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                  <Typography fontWeight={700}>Delivery#</Typography>
                                  {edit ?
                                    <InputField value={pickup && pickup[0] ? pickup[0].pickupDeliverNumber : ""} />
                                    : <Typography>{pickup && pickup[0] ? pickup[0].pickupDeliverNumber : ""}</Typography>}
                                </Stack>
                              </Stack>

                              {/* <p>PO Ref# {pickup && pickup[0] ? pickup[0].pickupReference : ''}</p> */}

                              {state.auth.user.role !== "driver" &&
                                <InputField
                                  id="outlined-multiline-static"
                                  placeholder="Pickup Notes"
                                  multiline
                                  rows={2}
                                  type='textarea'
                                  value={form.pickup[0] ? form.pickup[0].notes : ""}
                                  onChange={(event) =>
                                    handlePickDropChange(event, "pickup", "notes")
                                  }
                                  variant="outlined"
                                  readOnly={!edit}
                                />
                              }
                            </Grid>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={2} sx={{ display: 'flex', alignItem: 'center', mt: 5 }}>
                        {/*Arrow*/}
                        <ArrowForwardIosIcon
                          style={{
                            color: blue,
                            marginTop: "13%",
                            margin: '0 auto',
                            height: 40,
                            width: 40,
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        {/*DROP*/}
                        <Stack sx={{ textAlign: 'center' }}>
                          {edit ? state.auth.user.role !== "driver" && <Fragment>
                            <InputField
                              id="outlined-basic"
                              variant="outlined"
                              placeholder="Receiver Name"
                              value={form.drop[0] ? form.drop[0].receiverName : ""}
                              onChange={(event) =>
                                handlePickDropChange(event, "drop", "receiverName")
                              }
                            />
                            <InputField
                              id="outlined-basic"
                              variant="outlined"
                              placeholder="Address"
                              value={form.drop[0] ? form.drop[0].dropAddress : ""}
                              onChange={(event) =>
                                handlePickDropChange(event, "drop", "dropAddress")
                              }
                            />
                            <InputField
                              id="outlined-basic"
                              variant="outlined"
                              placeholder="City"
                              value={form.drop[0] ? form.drop[0].dropCity : ""}
                              onChange={(event) =>
                                handlePickDropChange(event, "drop", "dropCity")
                              }
                            />
                            <InputField
                              id="outlined-basic"
                              variant="outlined"
                              placeholder="State"
                              value={form.drop[0] ? form.drop[0].dropState : ""}
                              onChange={(event) =>
                                handlePickDropChange(event, "drop", "dropState")
                              }
                            />
                            <InputField
                              id="outlined-basic"
                              variant="outlined"
                              placeholder="Zip"
                              value={form.drop[0] ? form.drop[0].dropZip : ""}
                              onChange={(event) =>
                                handlePickDropChange(event, "drop", "dropZip")
                              }
                            />
                          </Fragment>
                            : <StaticDataShow
                              heading={'Drop'}
                              values={[
                                drop && drop[0] ? drop[0].receiverName : "",
                                form.drop[0] ? form.drop[0].dropAddress : "",
                                `${drop && drop[0] ? drop[0].dropCity : ""},
                                    ${drop && drop[0] ? drop[0].dropState : ""},
                                    ${drop && drop[0] ? drop[0].dropZip : ""}`
                              ]}
                            />}
                        </Stack>
                        <Stack spacing={2} sx={{ textAlign: 'center' }}>
                          {edit ? <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Drop Time</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  value={form.drop[0] ? form.drop[0].dropDate : ""}
                                  onChange={(date) => handleDateChange(date, "drop")}
                                  renderInput={(params) => <TextField {...params} variant='standard' />}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                  value={form.drop[0] ? form.drop[0].dropDate : ""}
                                  onChange={(date) => handleDateChange(date, "drop")}
                                  renderInput={(params) => <TextField {...params} variant='standard' />}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                  label='In Time'
                                  value={form.drop[0] ? form.drop[0].in_time : ""}
                                  onChange={(date) =>
                                    handleInOutTime(date, "drop", "in_time")
                                  }
                                  renderInput={(params) => <TextField {...params} variant='standard' />}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                  label='Out Time'
                                  value={form.drop[0] ? form.drop[0].out_time : ""}
                                  onChange={(date) =>
                                    handleInOutTime(date, "drop", "out_time")
                                  }
                                  renderInput={(params) => <TextField {...params} variant='standard' />}
                                />
                              </LocalizationProvider>
                            </Grid>
                          </Grid> :
                            <Fragment>
                              <StaticDataShow
                                spacing={2}
                                sxObject={{ mt: 2 }}
                                heading={'Drop Time'}
                                values={[
                                  drop && drop[0] ? (
                                    moment(drop[0].dropDate).format("LLL")
                                  ) : (
                                    ""
                                  )
                                ]}
                              />
                              <Stack direction='row' justifyContent='space-evenly' spacing={1}>
                                <Stack>
                                  {drop && drop[0] && drop[0].in_time ? (
                                    <Stack sx={{ textAlign: 'left' }}>
                                      <Typography variant='inherit' sx={{ color: '#8898AA', fontSize: 10 }}>In Time: </Typography>
                                      <Box>{moment(drop[0].in_time).format("h:mm A")}</Box>
                                    </Stack>
                                  ) : (
                                    "--"
                                  )}
                                </Stack>
                                <Stack>
                                  {drop && drop[0] && drop[0].out_time ? (
                                    <Stack sx={{ textAlign: 'left' }}>
                                      <Typography variant='inherit' sx={{ color: '#8898AA', fontSize: 10 }}>Out Time: </Typography>
                                      <Box>{moment(drop[0].out_time).format("h:mm A")}</Box>
                                    </Stack>
                                  ) : (
                                    "--"
                                  )}
                                </Stack>
                              </Stack>
                            </Fragment>}
                        </Stack>
                        <Grid item xs={12} sx={{ textAlign: "left", mt: 1 }}>
                          <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                              <Typography fontWeight={700}>PO#</Typography>
                              {edit ?
                                <InputField
                                  value={drop && drop[0] ? drop[0].dropPo : ""}
                                />
                                : <Typography>{drop && drop[0] ? drop[0].dropPo : ""}</Typography>}
                            </Stack>
                            <Stack direction='row' alignItems='center' spacing={1}>
                              <Typography fontWeight={700}>Reference# </Typography>
                              {edit ?
                                <InputField
                                  value={drop && drop[0] ? drop[0].dropReference : ""}
                                />
                                : <Typography>{drop && drop[0] ? drop[0].dropReference : ""}</Typography>}
                            </Stack>
                            <Stack direction='row' alignItems='center' spacing={1}>
                              <Typography fontWeight={700}>Deliver# </Typography>
                              {edit ?
                                <InputField
                                  value={drop && drop[0] ? drop[0].dropDeliverNumber : ""}
                                />
                                : <Typography>{drop && drop[0] ? drop[0].dropDeliverNumber : ""}</Typography>}
                            </Stack>
                          </Stack>

                          {/* <p>Deliver Ref#  {drop && drop[0] ? drop[0].dropReference : ''}</p> */}

                          {state.auth.user.role !== "driver" && (
                            <InputField
                              id="outlined-multiline-static"
                              placeholder="Drop Notes"
                              multiline
                              rows={2}
                              type="textarea"
                              value={form.drop[0] ? form.drop[0].notes : ""}
                              onChange={(event) =>
                                handlePickDropChange(event, "drop", "notes")
                              }
                              variant="outlined"
                              readOnly={!edit}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }}>
                <Stack spacing={2} sx={{ alignItems: 'end' }}>
                  <Stack style={{ margin: 0 }} direction={'row'} spacing={2}>
                    {rateConfirmation ? (
                      <span>
                        <a href={rateConfirmation} target="_blank">
                          Rate Con
                        </a>
                      </span>
                    ) : (
                      <span>Rate Con</span>
                    )}
                    <span>
                      {edit ? <Fragment>
                        <label htmlFor="contained-button-file1">
                          <input
                            style={{ display: 'none' }}
                            type="file"
                            multiple
                            name="rateConfirmation"
                            disabled={!edit || state.auth.user.role === "driver"}
                            onChange={handleFileChange}
                            ref={rateConfirmationRef}
                            id="contained-button-file1"
                          />
                          <Button variant="outlined" component="span" size='small'>
                            Attach
                          </Button>
                        </label>
                      </Fragment>
                        : getCheckStatusIcon(!!rateConfirmation)}
                    </span>
                  </Stack>
                  <Stack style={{ margin: 0 }} direction={'row'} spacing={2}>
                    {proofDelivery ? (
                      <span>
                        <a href={proofDelivery} target="_blank">
                          POD
                        </a>
                      </span>
                    ) : (
                      <span>POD</span>
                    )}
                    <span>
                      {edit ?
                        <label htmlFor="contained-button-file2">
                          <input
                            style={{ display: 'none' }}
                            type="file"
                            multiple
                            name="proofDelivery"
                            disabled={!edit}
                            onChange={handleFileChange}
                            ref={proofDeliveryRef}
                            id="contained-button-file2"
                          />
                          <Button variant="outlined" component="span" size='small'>
                            Attach
                          </Button>
                        </label>
                        : getCheckStatusIcon(!!proofDelivery)}
                    </span>
                  </Stack>
                  <Stack style={{ margin: 0 }} direction={'row'} spacing={2}>
                    {accessorials.length ? (
                      <span>
                        <a href={"#"} target="_blank">
                          Accessorials
                        </a>
                      </span>
                    ) : (
                      <span>Accessorials</span>
                    )}
                    <span>
                      {edit ? <Fragment>
                        <label htmlFor="contained-button-file3">
                          <input
                            style={{ display: 'none' }}
                            type="file"
                            multiple
                            name="accessorials"
                            disabled={!edit || state.auth.user.role === "driver"}
                            onChange={handleFileChange}
                            ref={rateConfirmationRef}
                            id="contained-button-file3"
                          />
                          <Button variant="outlined" component="span" size='small'>
                            Attach
                          </Button>
                        </label>
                      </Fragment>
                        : getCheckStatusIcon(!!accessorials?.length)}
                    </span>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            {/*******************NEW Grid END***********************************/}




            <Grid
              container
              spacing={2}
              className={classes.rootLoadDetailModal}
              style={{ marginTop: 10 }}
            >
              <Grid item xs={1}></Grid>
              <Grid item xs={4} justifyContent={'center'} sx={{ textAlign: 'center' }}>
                {/*<Typography item sx={{fontWeight: 600, fontSize:18, textAlign: 'center'}}>Pickup</Typography>*/}
                {/*<p>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <InputField*/}
                {/*      id="outlined-basic"*/}
                {/*      variant="outlined"*/}
                {/*      placeholder="Address"*/}
                {/*      value={form.pickup[0] ? form.pickup[0].pickupAddress : ""}*/}
                {/*      onChange={(event) =>*/}
                {/*        handlePickDropChange(event, "pickup", "pickupAddress")*/}
                {/*      }*/}
                {/*    />*/}
                {/*  ) : (*/}
                {/*    <TextPlaceHolder*/}
                {/*      value={pickup && pickup[0] ? pickup[0].pickupAddress : ""}*/}
                {/*    />*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <Grid*/}
                {/*      container*/}
                {/*      spacing={2}*/}
                {/*      className={classes.rootLoadDetailModal}*/}
                {/*    >*/}
                {/*      <Grid item xs={4}>*/}
                {/*        <InputField*/}
                {/*          id="outlined-basic"*/}
                {/*          variant="outlined"*/}
                {/*          placeholder="City"*/}
                {/*          value={*/}
                {/*            form.pickup[0] ? form.pickup[0].pickupCity : ""*/}
                {/*          }*/}
                {/*          onChange={(event) =>*/}
                {/*            handlePickDropChange(event, "pickup", "pickupCity")*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </Grid>*/}
                {/*      <Grid item xs={4}>*/}
                {/*        <InputField*/}
                {/*          id="outlined-basic"*/}
                {/*          placeholder="State"*/}
                {/*          value={*/}
                {/*            form.pickup[0] ? form.pickup[0].pickupState : ""*/}
                {/*          }*/}
                {/*          onChange={(event) =>*/}
                {/*            handlePickDropChange(event, "pickup", "pickupState")*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </Grid>*/}
                {/*      <Grid item xs={4}>*/}
                {/*        <InputField*/}
                {/*          id="outlined-basic"*/}
                {/*          variant="outlined"*/}
                {/*          placeholder="Zip"*/}
                {/*          value={form.pickup[0] ? form.pickup[0].pickupZip : ""}*/}
                {/*          onChange={(event) =>*/}
                {/*            handlePickDropChange(event, "pickup", "pickupZip")*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </Grid>*/}
                {/*    </Grid>*/}
                {/*  ) : (*/}
                {/*    <>*/}
                {/*      <TextPlaceHolder*/}
                {/*        value={pickup && pickup[0] ? pickup[0].pickupCity : ""}*/}
                {/*      />*/}
                {/*      ,*/}
                {/*      <TextPlaceHolder*/}
                {/*        value={pickup && pickup[0] ? pickup[0].pickupState : ""}*/}
                {/*      />*/}
                {/*      ,*/}
                {/*      <TextPlaceHolder*/}
                {/*        value={pickup && pickup[0] ? pickup[0].pickupZip : ""}*/}
                {/*      />*/}
                {/*    </>*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  <Typography sx={{fontWeight:600, mb:1, textAlign: 'center'}}>Pickup Time</Typography>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <Grid container>*/}
                {/*      <Grid item xs={6}>*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardTimePicker*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="time-picker"*/}
                {/*            value={*/}
                {/*              form.pickup[0] ? form.pickup[0].pickupDate : ""*/}
                {/*            }*/}
                {/*            onChange={(date) =>*/}
                {/*              handleDateChange(date, "pickup")*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      </Grid>*/}
                {/*      <Grid item xs={6}>*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardDatePicker*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="date-picker-dialog"*/}
                {/*            format="MM/dd/yyyy"*/}
                {/*            value={*/}
                {/*              form.pickup[0] ? form.pickup[0].pickupDate : ""*/}
                {/*            }*/}
                {/*            onChange={(date) =>*/}
                {/*              handleDateChange(date, "pickup")*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      </Grid>*/}
                {/*    </Grid>*/}
                {/*  ) : pickup && pickup[0] ? (*/}
                {/*    moment(pickup[0].pickupDate).format("LLL")*/}
                {/*  ) : (*/}
                {/*    ""*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  <Grid container>*/}
                {/*    <Grid item xs={6}>*/}
                {/*      {edit ? (*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardTimePicker*/}
                {/*            label="In Time"*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="time-picker"*/}
                {/*            value={form.pickup[0] ? form.pickup[0].in_time : ""}*/}
                {/*            onChange={(date) =>*/}
                {/*              handleInOutTime(date, "pickup", "in_time")*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      ) : pickup && pickup[0] && pickup[0].in_time ? (*/}
                {/*        "In time: " + moment(pickup[0].in_time).format("h:mm A")*/}
                {/*      ) : (*/}
                {/*        "--"*/}
                {/*      )}*/}
                {/*    </Grid>*/}
                {/*    <Grid item xs={6}>*/}
                {/*      {edit ? (*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardTimePicker*/}
                {/*            label="Out Time"*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="time-picker"*/}
                {/*            value={*/}
                {/*              form.pickup[0] ? form.pickup[0].out_time : ""*/}
                {/*            }*/}
                {/*            onChange={(date) =>*/}
                {/*              handleInOutTime(date, "pickup", "out_time")*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      ) : pickup && pickup[0] && pickup[0].out_time ? (*/}
                {/*        "Out time: " +*/}
                {/*        moment(pickup[0].out_time).format("h:mm A")*/}
                {/*      ) : (*/}
                {/*        "--"*/}
                {/*      )}*/}
                {/*    </Grid>*/}
                {/*  </Grid>*/}
                {/*</p>*/}
              </Grid>
              <Grid item xs={2} justifyContent='center' display={'flex'}>
                {/*<ArrowForwardIosIcon*/}
                {/*  style={{*/}
                {/*    color: blue,*/}
                {/*    marginTop: "13%",*/}
                {/*    margin: '0 auto',*/}
                {/*    height: 40,*/}
                {/*    width: 40,*/}
                {/*  }}*/}
                {/*/>*/}
              </Grid>
              <Grid item xs={4} style={{ textAlign: "center" }}>
                {/*<Typography item sx={{fontSize:18, textAlign: 'center', fontWeight:600,}}>Drop</Typography>*/}
                {/*<p>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <InputField*/}
                {/*      id="outlined-basic"*/}
                {/*      variant="outlined"*/}
                {/*      placeholder="Receiver Name"*/}
                {/*      value={form.drop[0] ? form.drop[0].receiverName : ""}*/}
                {/*      onChange={(event) =>*/}
                {/*        handlePickDropChange(event, "drop", "receiverName")*/}
                {/*      }*/}
                {/*    />*/}
                {/*  ) : (*/}
                {/*    <TextPlaceHolder*/}
                {/*      value={drop && drop[0] ? drop[0].receiverName : ""}*/}
                {/*    />*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <InputField*/}
                {/*      id="outlined-basic"*/}
                {/*      variant="outlined"*/}
                {/*      placeholder="Address"*/}
                {/*      value={form.drop[0] ? form.drop[0].dropAddress : ""}*/}
                {/*      onChange={(event) =>*/}
                {/*        handlePickDropChange(event, "drop", "dropAddress")*/}
                {/*      }*/}
                {/*    />*/}
                {/*  ) : (*/}
                {/*    <TextPlaceHolder*/}
                {/*      value={drop && drop[0] ? drop[0].dropAddress : ""}*/}
                {/*    />*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <Grid*/}
                {/*      container*/}
                {/*      spacing={2}*/}
                {/*      className={classes.rootLoadDetailModal}*/}
                {/*    >*/}
                {/*      <Grid item xs={4}>*/}
                {/*        <InputField*/}
                {/*          id="outlined-basic"*/}
                {/*          variant="outlined"*/}
                {/*          placeholder="City"*/}
                {/*          value={form.drop[0] ? form.drop[0].dropCity : ""}*/}
                {/*          onChange={(event) =>*/}
                {/*            handlePickDropChange(event, "drop", "dropCity")*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </Grid>*/}
                {/*      <Grid item xs={4}>*/}
                {/*        <InputField*/}
                {/*          id="outlined-basic"*/}
                {/*          variant="outlined"*/}
                {/*          placeholder="State"*/}
                {/*          value={form.drop[0] ? form.drop[0].dropState : ""}*/}
                {/*          onChange={(event) =>*/}
                {/*            handlePickDropChange(event, "drop", "dropState")*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </Grid>*/}
                {/*      <Grid item xs={4}>*/}
                {/*        <InputField*/}
                {/*          id="outlined-basic"*/}
                {/*          variant="outlined"*/}
                {/*          placeholder="Zip"*/}
                {/*          value={form.drop[0] ? form.drop[0].dropZip : ""}*/}
                {/*          onChange={(event) =>*/}
                {/*            handlePickDropChange(event, "drop", "dropZip")*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </Grid>*/}
                {/*    </Grid>*/}
                {/*  ) : (*/}
                {/*    <>*/}
                {/*      <TextPlaceHolder*/}
                {/*        value={drop && drop[0] ? drop[0].dropCity : ""}*/}
                {/*      />*/}
                {/*      ,*/}
                {/*      <TextPlaceHolder*/}
                {/*        value={drop && drop[0] ? drop[0].dropState : ""}*/}
                {/*      />*/}
                {/*      ,*/}
                {/*      <TextPlaceHolder*/}
                {/*        value={drop && drop[0] ? drop[0].dropZip : ""}*/}
                {/*      />*/}
                {/*    </>*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  <Typography sx={{fontWeight:600, mb:1}}>Drop Time</Typography>*/}
                {/*  {edit && state.auth.user.role !== "driver" ? (*/}
                {/*    <Grid container>*/}
                {/*      <Grid item xs={6}>*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardTimePicker*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="time-picker"*/}
                {/*            value={form.drop[0] ? form.drop[0].dropDate : ""}*/}
                {/*            onChange={(date) => handleDateChange(date, "drop")}*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      </Grid>*/}
                {/*      <Grid item xs={6}>*/}
                {/*        <LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                {/*          <DatePicker*/}
                {/*              // label="Basic example"*/}
                {/*              value={form.drop[0] ? form.drop[0].dropDate : ""}*/}
                {/*              onChange={(newValue) => {*/}
                {/*                handleDateChange(newValue, "drop")*/}
                {/*              }}*/}
                {/*              renderInput={(params) => <TextField {...params} />}*/}
                {/*          />*/}
                {/*        </LocalizationProvider>*/}
                {/*      </Grid>*/}
                {/*    </Grid>*/}
                {/*  ) : drop && drop[0] ? (*/}
                {/*    moment(drop[0].dropDate).format("LLL")*/}
                {/*  ) : (*/}
                {/*    ""*/}
                {/*  )}*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  <Grid container>*/}
                {/*    <Grid item xs={6}>*/}
                {/*      {edit ? (*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardTimePicker*/}
                {/*            label="In Time"*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="time-picker"*/}
                {/*            value={form.drop[0] ? form.drop[0].in_time : ""}*/}
                {/*            onChange={(date) =>*/}
                {/*              handleInOutTime(date, "drop", "in_time")*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      ) : drop && drop[0] && drop[0].in_time ? (*/}
                {/*        "In time: " + moment(drop[0].in_time).format("h:mm A")*/}
                {/*      ) : (*/}
                {/*        "--"*/}
                {/*      )}*/}
                {/*    </Grid>*/}
                {/*    <Grid item xs={6}>*/}
                {/*      {edit ? (*/}
                {/*        <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                {/*          <KeyboardTimePicker*/}
                {/*            label="Out Time"*/}
                {/*            className={classes.textFieldDialog}*/}
                {/*            InputProps={{*/}
                {/*              classes: { input: classes.resizeDialog },*/}
                {/*            }}*/}
                {/*            size="small"*/}
                {/*            id="time-picker"*/}
                {/*            value={form.drop[0] ? form.drop[0].out_time : ""}*/}
                {/*            onChange={(date) =>*/}
                {/*              handleInOutTime(date, "drop", "out_time")*/}
                {/*            }*/}
                {/*          />*/}
                {/*        </MuiPickersUtilsProvider>*/}
                {/*      ) : drop && drop[0] && drop[0].out_time ? (*/}
                {/*        "Out time: " + moment(drop[0].out_time).format("h:mm A")*/}
                {/*      ) : (*/}
                {/*        "--"*/}
                {/*      )}*/}
                {/*    </Grid>*/}
                {/*  </Grid>*/}
                {/*</p>*/}
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid container spacing={2} className={classes.rootLoadDetailModal}>
              {/*<Grid item xs={4} style={{ textAlign: "left" }}>*/}
              {/*  <Stack spacing={2}>*/}
              {/*    <Stack direction='row' alignItems={'center'} spacing={1}>*/}
              {/*      <Typography fontWeight={700}>Pickup Reference#{" "}</Typography>*/}
              {/*      <Typography>{pickup && pickup[0] ? pickup[0].pickupReference : ""}</Typography>*/}
              {/*    </Stack>*/}
              {/*    <Stack direction='row' alignItems='center' spacing={1}>*/}
              {/*      <Typography fontWeight={700}>PO#</Typography>*/}
              {/*      <Typography>{pickup && pickup[0] ? pickup[0].pickupPo : ""}</Typography>*/}
              {/*    </Stack>*/}
              {/*    <Stack direction='row' alignItems='center' spacing={1}>*/}
              {/*      <Typography fontWeight={700}>Pickup delivery#</Typography>*/}
              {/*      <Typography>{pickup && pickup[0] ? pickup[0].pickupDeliverNumber : ""}</Typography>*/}
              {/*    </Stack>*/}
              {/*  </Stack>*/}

              {/*  /!* <p>PO Ref# {pickup && pickup[0] ? pickup[0].pickupReference : ''}</p> *!/*/}

              {/*  {!edit ? (*/}
              {/*    <p*/}
              {/*      dangerouslySetInnerHTML={{*/}
              {/*        __html:*/}
              {/*          pickup && pickup[0]*/}
              {/*            ? "Notes: " +*/}
              {/*              pickup[0].notes.replace(/(.{15})/g, "$1<br>")*/}
              {/*            : "Notes:",*/}
              {/*      }}*/}
              {/*    ></p>*/}
              {/*  ) : state.auth.user.role !== "driver" ? (*/}
              {/*    <InputField*/}
              {/*      id="outlined-multiline-static"*/}
              {/*      placeholder="Pickup Notes"*/}
              {/*      multiline*/}
              {/*      rows={2}*/}
              {/*      type='textarea'*/}
              {/*      value={form.pickup[0] ? form.pickup[0].notes : ""}*/}
              {/*      onChange={(event) =>*/}
              {/*        handlePickDropChange(event, "pickup", "notes")*/}
              {/*      }*/}
              {/*      variant="outlined"*/}
              {/*    />*/}
              {/*  ) : (*/}
              {/*    ""*/}
              {/*  )}*/}
              {/*</Grid>*/}
            </Grid>
            {/*<Grid*/}
            {/*  container*/}
            {/*  spacing={2}*/}
            {/*  className={classes.rootLoadDetailModal}*/}
            {/*  style={{ height: "100px" }}*/}
            {/*>*/}
            {/*  /!*<Grid item xs={4} style={{ position: "relative" }}>*!/*/}
            {/*  /!*  /!*<div>*!/*!/*/}
            {/*  /!*  /!*  {!edit ? (*!/*!/*/}
            {/*  /!*  /!*    <Fragment>*!/*!/*/}
            {/*  /!*  /!*      <IconButton onClick={() => setEdit(true)} title='Edit'>*!/*!/*/}
            {/*  /!*  /!*        <EditIcon*!/*!/*/}
            {/*  /!*  /!*          fontSize="large"*!/*!/*/}
            {/*  /!*  /!*          color="primary"*!/*!/*/}
            {/*  /!*  /!*        />*!/*!/*/}
            {/*  /!*  /!*      </IconButton>*!/*!/*/}
            {/*  /!*  /!*      <IconButton onClick={createCopy} title='Create Copy'>*!/*!/*/}
            {/*  /!*  /!*        <FileCopyOutlined*!/*!/*/}
            {/*  /!*  /!*          fontSize="large"*!/*!/*/}
            {/*  /!*  /!*          color="primary"*!/*!/*/}
            {/*  /!*  /!*        />*!/*!/*/}
            {/*  /!*  /!*      </IconButton>*!/*!/*/}
            {/*  /!*  /!*    </Fragment>*!/*!/*/}
            {/*  /!*  /!*  ) : (*!/*!/*/}
            {/*  /!*  /!*    <>*!/*!/*/}
            {/*  /!*  /!*      <IconButton onClick={handleSubmit}>*!/*!/*/}
            {/*  /!*  /!*        <DoneIcon*!/*!/*/}
            {/*  /!*  /!*          fontSize="large"*!/*!/*/}
            {/*  /!*  /!*          color="primary"*!/*!/*/}
            {/*  /!*  /!*        />*!/*!/*/}
            {/*  /!*  /!*      </IconButton>*!/*!/*/}
            {/*  /!*  /!*      <IconButton onClick={handleCancel}>*!/*!/*/}
            {/*  /!*  /!*        <CloseIcon*!/*!/*/}
            {/*  /!*  /!*          fontSize="large"*!/*!/*/}
            {/*  /!*  /!*          color="primary"*!/*!/*/}
            {/*  /!*  /!*        />*!/*!/*/}
            {/*  /!*  /!*      </IconButton>*!/*!/*/}
            {/*  /!*  /!*    </>*!/*!/*/}
            {/*  /!*  /!*  )}*!/*!/*/}
            {/*  /!*  /!*</div>*!/*!/*/}
            {/*  /!*</Grid>*!/*/}
            {/*  /!*<Grid*!/*/}
            {/*  /!*  item*!/*/}
            {/*  /!*  xs={4}*!/*/}
            {/*  /!*  style={{ textAlign: "center", position: "relative" }}*!/*/}
            {/*  /!*>*!/*/}
            {/*  /!*  {edit ? (*!/*/}
            {/*  /!*    <div style={verticalAlignStyle}>*!/*/}
            {/*  /!*      <Grid container style={{ margin: "10px" }}>*!/*/}
            {/*  /!*        <Grid item xs={6} style={{ textAlign: "left" }}>*!/*/}
            {/*  /!*          <label>Rate Confirmation</label>*!/*/}
            {/*  /!*        </Grid>*!/*/}
            {/*  /!*        <Grid item xs={6}>*!/*/}
            {/*  /!*          <input*!/*/}
            {/*  /!*            type="file"*!/*/}
            {/*  /!*            multiple*!/*/}
            {/*  /!*            name="rateConfirmation"*!/*/}
            {/*  /!*            disabled={!edit || state.auth.user.role === "driver"}*!/*/}
            {/*  /!*            onChange={handleFileChange}*!/*/}
            {/*  /!*            ref={rateConfirmationRef}*!/*/}
            {/*  /!*          />*!/*/}
            {/*  /!*        </Grid>*!/*/}
            {/*  /!*      </Grid>*!/*/}
            {/*  /!*      <Grid container style={{ margin: "10px" }}>*!/*/}
            {/*  /!*        <Grid item xs={6} style={{ textAlign: "left" }}>*!/*/}
            {/*  /!*          <label>Proof of Address</label>*!/*/}
            {/*  /!*        </Grid>*!/*/}
            {/*  /!*        <Grid item xs={6}>*!/*/}
            {/*  /!*          <input*!/*/}
            {/*  /!*            type="file"*!/*/}
            {/*  /!*            multiple*!/*/}
            {/*  /!*            name="proofDelivery"*!/*/}
            {/*  /!*            disabled={!edit}*!/*/}
            {/*  /!*            onChange={handleFileChange}*!/*/}
            {/*  /!*            ref={proofDeliveryRef}*!/*/}
            {/*  /!*          />*!/*/}
            {/*  /!*        </Grid>*!/*/}
            {/*  /!*      </Grid>*!/*/}
            {/*  /!*    </div>*!/*/}
            {/*  /!*  ) : (*!/*/}
            {/*  /!*    <div style={verticalAlignStyle}>*!/*/}
            {/*  /!*      /!* <p style={{margin: 0}}>Echo Global Logisitcs</p>*!/*/}
            {/*  /!*                  <p style={{margin: 0}}>Rep: William Penske</p>*!/*/}
            {/*  /!*                  <p style={{margin: 0}}>618-501-2250</p>*!/*/}
            {/*  /!*                  <p style={{margin: 0}}>wpenske@echo.com</p> *!/*!/*/}
            {/*  /!*    </div>*!/*/}
            {/*  /!*  )}*!/*/}
            {/*  /!*</Grid>*!/*/}
            {/*  /!*<Grid item xs={4} style={{ position: "relative" }}>*!/*/}
            {/*  /!*  <div*!/*/}
            {/*  /!*    className="load-checklist"*!/*/}
            {/*  /!*    style={{*!/*/}
            {/*  /!*      position: "absolute",*!/*/}
            {/*  /!*      top: "50%",*!/*/}
            {/*  /!*      left: "80%",*!/*/}
            {/*  /!*      transform: "translate(-50%, -50%)",*!/*/}
            {/*  /!*    }}*!/*/}
            {/*  /!*  >*!/*/}
            {/*  /!*    <p style={{ margin: 0 }}>*!/*/}
            {/*  /!*      {rateConfirmation ? (*!/*/}
            {/*  /!*        <span>*!/*/}
            {/*  /!*          <a href={rateConfirmation} target="_blank">*!/*/}
            {/*  /!*            Rate Confirmation*!/*/}
            {/*  /!*          </a>*!/*/}
            {/*  /!*        </span>*!/*/}
            {/*  /!*      ) : (*!/*/}
            {/*  /!*        <span>Rate Confirmation</span>*!/*/}
            {/*  /!*      )}*!/*/}
            {/*  /!*      <span>*!/*/}
            {/*  /!*        {rateConfirmation ? (*!/*/}
            {/*  /!*          <CheckCircleIcon style={{color: successIconColor}}/>*!/*/}
            {/*  /!*        ) : (*!/*/}
            {/*  /!*           <CancelIcon style={{color: errorIconColor}}/>*!/*/}
            {/*  /!*        )}*!/*/}
            {/*  /!*      </span>*!/*/}
            {/*  /!*    </p>*!/*/}
            {/*  /!*    <p style={{ margin: 0 }}>*!/*/}
            {/*  /!*      {proofDelivery ? (*!/*/}
            {/*  /!*        <span>*!/*/}
            {/*  /!*          <a href={rateConfirmation} target="_blank">*!/*/}
            {/*  /!*            Proof of Delivery*!/*/}
            {/*  /!*          </a>*!/*/}
            {/*  /!*        </span>*!/*/}
            {/*  /!*      ) : (*!/*/}
            {/*  /!*        <span>Proof of Delivery</span>*!/*/}
            {/*  /!*      )}*!/*/}
            {/*  /!*      <span>*!/*/}
            {/*  /!*        {proofDelivery ? (*!/*/}
            {/*  /!*          <CheckCircleIcon style={{color: successIconColor}}/>*!/*/}
            {/*  /!*        ) : (*!/*/}
            {/*  /!*           <CancelIcon style={{color: errorIconColor}}/>*!/*/}
            {/*  /!*        )}*!/*/}
            {/*  /!*      </span>*!/*/}
            {/*  /!*    </p>*!/*/}
            {/*  /!*  </div>*!/*/}
            {/*  /!*</Grid>*!/*/}
            {/*</Grid>*/}
          </form>
        </div>
      </Modal>
    </>
  );
};

export default LoadDetailModal;
