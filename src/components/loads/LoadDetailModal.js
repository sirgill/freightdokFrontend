import React, { Fragment, useEffect, useRef, useState } from "react";
import _ from 'lodash'
import {
  Divider,
  Grid,
  Stack,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Select,
  Modal,
  CircularProgress
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
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import TimePicker from '@mui/lab/TimePicker';
// import DatePicker from '@mui/lab/DatePicker';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import { blue } from "../layout/ui/Theme";
import { LOAD_STATUSES } from "../constants";
import { green } from "@mui/material/colors";
import LoadDetailsUploadComponent from "./components/LoadDetailsUploadComponent";
import {getRoleNameString} from "../client/constants";


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
const DATE_PICKER_SLOT_PROPS = {
  textField: {
    helperText: 'DD/MM/YYYY hh:mm AM/PM',
    size: 'small',
    fullWidth: true
  },
},
    TIME_PICKET_SLOT_PROPS = {
      textField: {
        size: 'small',
        fullWidth: true
      }
    }

const TextPlaceHolder = ({ value }) => (value ? value : "--");

const LoadDetailModal = ({
  modalEdit,
  open,
  handleClose,
  listBarType,
  load, canUpdate
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
  const [isProcessingAsyncRequest, setIsProcessingAsyncRequest] = useState(false);
  const rateConfirmationRef = useRef();
  const proofDeliveryRef = useRef();
  const accessorialsRef = useRef(),
    SelectElement = edit ? OutlinedInput : FilledInput;
  const {assignees = [] } = state.driver || {};
  const assignedToOptions = assignees.map((item) => {
    const { _id, firstName, lastName, role, user = {} } = item || {},
        {name = '', role: assigneeRole, _id: assigneeId} = user || {};
    return {
      name, _id: assigneeId || _id, firstName, lastName, role: getRoleNameString(assigneeRole || role)
    }
  }) || [];

  useEffect(() => {
    setupDrivers();
    setForm({
      status,
      assignedTo: user?._id,
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
    setIsProcessingAsyncRequest(false);
    if (isSuccess) handleClose();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.status !== "Empty") {
      form.invoice_created = false;
    }
    setIsProcessingAsyncRequest(true);
    dispatch(updateLoad({ ...form, _id }, listBarType, bktFiles, afterSubmit));
    // resetFileInputs();
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handlePickDropChange = ({ target: { value } }, keyToUpdate, childKey) => {
    if (keyToUpdate === "pickup") {
      setForm({ ...form, pickup: [{ ...form.pickup[0], [childKey]: value }] });
    }
    else if (keyToUpdate === "drop") {
      setForm({ ...form, drop: [{ ...form.drop[0], [childKey]: value }] });
    }
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
    setIsProcessingAsyncRequest(true);
    dispatch(addLoad(body, afterSubmit));
  };

  if (bucketFiles.length) {
    const alpha = [...bucketFiles];
    bucketFiles = {
      'proofDelivery': [],
      'rateConfirmation': [],
      'accessorialsFiles': []
    };
    alpha.forEach((item = {}, idx) => {
      const { fileType = "", fileLocation = "" } = item;
      bucketFiles[fileType].push(fileLocation)

    });
  } else bucketFiles = {};

  const { rateConfirmation = [], proofDelivery = [], accessorialsFiles = [] } = bucketFiles || {};

  const StaticDataShow = ({ heading, values = [], spacing = 2, sxObject = {} }) => {
    return <Stack spacing={spacing} sx={{ ...sxObject }} className='staticInfo'>
      <Stack><Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center', pt: 3 }}>{heading}</Typography></Stack>
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
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div style={{ width: '90%' }} className={classes.paper}>
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
                    <FormControl sx={{ m: 1 }} size="small" fullWidth>
                      <InputLabel id="multiple-name">Status</InputLabel>
                      <Select
                        id="multiple-name"
                        name="status"
                        value={form.status}
                        onChange={({ target: { value } }) => setForm({ ...form, status: value, })}
                        input={<SelectElement size='small' label="" notched={false} sx={{}} />}
                        MenuProps={MenuProps}
                        disabled={!edit || state.auth.user.role === "driver"}
                      >
                        {LOAD_STATUSES.map((name) => (
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
                    <FormControl sx={{ m: 1 }} size="small" fullWidth>
                      <InputLabel id="multiple-name">Assigned</InputLabel>
                      <Select
                        id="multiple-name"
                        name="assignedTo"
                        disabled={!edit || state.auth.user.role === "driver"}
                        value={form.assignedTo}
                        onChange={({ target: { value } }) => setForm({ ...form, assignedTo: value, })}
                        input={<SelectElement size='small' label="" notched={false} sx={{}} />}
                        MenuProps={MenuProps}
                      >
                        {assignedToOptions.map((assignee) => (
                          <MenuItem
                            key={assignee._id}
                            value={assignee._id}
                          // style={getStyles(name, personName, theme)}
                          >
                            {`${assignee.firstName} ${assignee.lastName} (${assignee.role || '--'})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="demo-multiple-name-label">Accessorials</InputLabel>
                    <FormControl sx={{ m: 0 }} fullWidth>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={form.accessorials}
                        onChange={({ target: { value } }) => setForm({ ...form, accessorials: typeof value === 'string' ? value.split(',') : value, })}
                        input={<SelectElement size='small' label="" notched={false} />}
                        MenuProps={MenuProps}
                        disabled={!edit}
                      >
                        {[
                          { id: 'Tonu', label: 'Tonu' },
                          { id: 'Detention', label: 'Detention' },
                          { id: 'Lumper-by-Broker', label: 'Lumper by Broker' },
                          { id: 'Lumper-by-Carrier', label: 'Lumper by Carrier' },
                          { id: 'Layover', label: 'Layover' },
                          { id: 'scale-ticket', label: 'Scale Ticket' },
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
                  {edit ? <Box sx={{ position: 'relative' }}>
                    <IconButton onClick={handleSubmit} disabled={isProcessingAsyncRequest}>
                      <DoneIcon
                        fontSize="large"
                        color={isProcessingAsyncRequest ? "disabled" : 'primary'}
                      />
                    </IconButton>
                    {isProcessingAsyncRequest && <CircularProgress
                      size={65}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                      }}
                    />}
                  </Box>
                    : <IconButton onClick={() => setEdit(true)} title='Edit' disabled={isProcessingAsyncRequest || !canUpdate}>
                      <EditIcon
                        fontSize="large"
                        color={isProcessingAsyncRequest ? "disabled" : 'primary'}
                      />
                    </IconButton>}
                  {edit ? <IconButton onClick={handleCancel} disabled={isProcessingAsyncRequest}>
                    <CloseIcon
                      fontSize="large"
                      color={isProcessingAsyncRequest ? "disabled" : 'primary'}
                    />
                  </IconButton> : <IconButton onClick={createCopy} title='Create Copy' disabled={isProcessingAsyncRequest || !canUpdate}>
                    <FileCopyOutlined
                      fontSize="large"
                      color={isProcessingAsyncRequest ? "disabled" : 'primary'}
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
                                pickup && pickup[0] ? pickup[0].shipperName : "",
                                form.pickup[0] ? form.pickup[0].pickupAddress : "",
                                `${pickup && pickup[0] ? pickup[0].pickupCity : ""}, ${pickup && pickup[0] ? pickup[0].pickupState : ""}, ${pickup && pickup[0] ? pickup[0].pickupZip : ""}`,
                              ]}
                            />}
                          </Stack>
                          <Stack spacing={2}>
                            {edit ? <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Pickup Time</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DateTimePicker
                                      value={moment(form.pickup[0] ? form.pickup[0].pickupDate : "") || new Date()}
                                      onChange={(date) => handleDateChange(date, "pickup")}
                                      slotProps={DATE_PICKER_SLOT_PROPS}
                                      label='Pickup Date'
                                  />
                                </LocalizationProvider>
                                {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                                {/*  <DatePicker*/}
                                {/*    value={*/}
                                {/*      form.pickup[0] ? form.pickup[0].pickupDate : ""*/}
                                {/*    }*/}
                                {/*    onChange={(date) =>*/}
                                {/*      handleDateChange(date, "pickup")*/}
                                {/*    }*/}
                                {/*    renderInput={(params) => <TextField {...params} variant='standard' />}*/}
                                {/*  />*/}
                                {/*</LocalizationProvider>*/}
                              </Grid>
                              {/*<Grid item xs={6}>*/}
                              {/*    <TimePicker*/}
                              {/*      value={moment(form.pickup[0] ? form.pickup[0].pickupDate : "")}*/}
                              {/*      onChange={(date) =>*/}
                              {/*        handleDateChange(date, "pickup")*/}
                              {/*      }*/}
                              {/*      label='Pickup Time'*/}
                              {/*      slotProps={TIME_PICKET_SLOT_PROPS}*/}
                              {/*    />*/}
                              {/*</Grid>*/}
                              <Grid item xs={6}>
                                {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                                {/*  <TimePicker*/}
                                {/*    label='In Time'*/}
                                {/*    value={form.pickup[0] ? form.pickup[0].in_time : ""}*/}
                                {/*    onChange={(date) =>*/}
                                {/*      handleInOutTime(date, "pickup", "in_time")*/}
                                {/*    }*/}
                                {/*    renderInput={(params) => <TextField {...params} variant='standard' />}*/}
                                {/*  />*/}
                                {/*</LocalizationProvider>*/}
                                <TimePicker
                                    label='In Time'
                                    value={moment( form.pickup[0] ? form.pickup[0].in_time : "")}
                                    onChange={(date) =>
                                        handleInOutTime(date, "pickup", "in_time")
                                    }
                                    slotProps={TIME_PICKET_SLOT_PROPS}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                  <TimePicker
                                    label='Out Time'
                                    value={moment(form.pickup[0] ? form.pickup[0].out_time : "")}
                                    onChange={(date) =>
                                      handleInOutTime(date, "pickup", "out_time")
                                    }
                                    slotProps={TIME_PICKET_SLOT_PROPS}
                                  />
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
                                        <Typography variant='subtitle2' sx={{ color: '#595959' }}>In Time: </Typography>
                                        <Box>{moment(pickup[0].in_time).format("h:mm A")}</Box>
                                      </Stack>
                                    ) : (
                                      "--"
                                    )}
                                  </Stack>
                                  <Stack>
                                    {pickup && pickup[0] && pickup[0].out_time ? (
                                      <Stack sx={{ textAlign: 'left' }}>
                                        <Typography variant='subtitle2' sx={{ color: '#595959' }}>Out Time:</Typography>
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
                                    <InputField
                                      value={form && form.pickup[0] ? form.pickup[0].pickupPo : ""}
                                      onChange={(e) => handlePickDropChange(e, 'pickup', 'pickupPo')}
                                    />
                                    : <Typography>{pickup && pickup[0] ? pickup[0].pickupPo : ""}</Typography>}
                                </Stack>
                                <Stack direction='row' alignItems={'center'} spacing={1}>
                                  <Typography fontWeight={700}>Reference#</Typography>
                                  {edit ?
                                    <InputField
                                      value={pickup && form.pickup[0] ? form.pickup[0].pickupReference : ""}
                                      onChange={(e) => handlePickDropChange(e, 'pickup', 'pickupReference')}
                                    />
                                    : <Typography>{pickup && pickup[0] ? pickup[0].pickupReference : ""}</Typography>}
                                </Stack>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                  <Typography fontWeight={700}>Delivery#</Typography>
                                  {edit ?
                                    <InputField
                                      value={pickup && form.pickup[0] ? form.pickup[0].pickupDeliverNumber : ""}
                                      onChange={(e) => handlePickDropChange(e, 'pickup', 'pickupDeliverNumber')}
                                    />
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
                            <Grid item xs={12}>
                              <DateTimePicker
                                  value={moment(form.drop[0] ? form.drop[0].dropDate : "") || new Date()}
                                  onChange={(date) => handleDateChange(date, "drop")}
                                  slotProps={DATE_PICKER_SLOT_PROPS}
                                  label='Drop Date'
                              />
                              {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                              {/*  <DatePicker*/}
                              {/*    value={form.drop[0] ? form.drop[0].dropDate : ""}*/}
                              {/*    onChange={(date) => handleDateChange(date, "drop")}*/}
                              {/*    renderInput={(params) => <TextField {...params} variant='standard' />}*/}
                              {/*  />*/}
                              {/*</LocalizationProvider>*/}
                            </Grid>
                            {/*<Grid item xs={6}>*/}
                            {/*    <TimePicker*/}
                            {/*        label='Drop Time'*/}
                            {/*      value={moment(form.drop[0] ? form.drop[0].dropDate : "")}*/}
                            {/*      onChange={(date) => handleDateChange(date, "drop")}*/}
                            {/*      slotProps={TIME_PICKET_SLOT_PROPS}*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                            <Grid item xs={6}>
                              <TimePicker
                                  label='In Time'
                                  value={moment(form.drop[0] ? form.drop[0].in_time : "") || new Date()}
                                  onChange={(date) => handleInOutTime(date, "drop", "in_time")}
                                  slotProps={TIME_PICKET_SLOT_PROPS}
                              />
                              {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                              {/*  <TimePicker*/}
                              {/*    label='In Time'*/}
                              {/*    value={form.drop[0] ? form.drop[0].in_time : ""}*/}
                              {/*    onChange={(date) =>*/}
                              {/*      handleInOutTime(date, "drop", "in_time")*/}
                              {/*    }*/}
                              {/*    renderInput={(params) => <TextField {...params} variant='standard' />}*/}
                              {/*  />*/}
                              {/*</LocalizationProvider>*/}
                            </Grid>
                            <Grid item xs={6}>
                              <TimePicker
                                  label='Out Time'
                                  value={moment(form.drop[0] ? form.drop[0].out_time : "")}
                                  onChange={(date) =>
                                      handleInOutTime(date, "drop", "out_time")
                                  }
                                  slotProps={TIME_PICKET_SLOT_PROPS}
                              />
                              {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                              {/*  <TimePicker*/}
                              {/*    label='Out Time'*/}
                              {/*    value={form.drop[0] ? form.drop[0].out_time : ""}*/}
                              {/*    onChange={(date) =>*/}
                              {/*      handleInOutTime(date, "drop", "out_time")*/}
                              {/*    }*/}
                              {/*    renderInput={(params) => <TextField {...params} variant='standard' />}*/}
                              {/*  />*/}
                              {/*</LocalizationProvider>*/}
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
                                      <Typography variant='subtitle2' sx={{ color: '#595959' }}>In Time: </Typography>
                                      <Box>{moment(drop[0].in_time).format("h:mm A")}</Box>
                                    </Stack>
                                  ) : (
                                    "--"
                                  )}
                                </Stack>
                                <Stack>
                                  {drop && drop[0] && drop[0].out_time ? (
                                    <Stack sx={{ textAlign: 'left' }}>
                                      <Typography variant='subtitle2' sx={{ color: '#595959' }}>Out Time: </Typography>
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
                                  dropPo='dropPo'
                                  value={form && form.drop[0] ? form.drop[0].dropPo : ""}
                                  onChange={(e) => handlePickDropChange(e, 'drop', 'dropPo')}
                                />
                                : <Typography>{drop && drop[0] ? drop[0].dropPo : ""}</Typography>}
                            </Stack>
                            <Stack direction='row' alignItems='center' spacing={1}>
                              <Typography fontWeight={700}>Reference# </Typography>
                              {edit ?
                                <InputField
                                  value={form && form.drop[0] ? form.drop[0].dropReference : ""}
                                  onChange={(e) => handlePickDropChange(e, 'drop', 'dropReference')}
                                />
                                : <Typography>{drop && drop[0] ? drop[0].dropReference : ""}</Typography>}
                            </Stack>
                            <Stack direction='row' alignItems='center' spacing={1}>
                              <Typography fontWeight={700}>Deliver# </Typography>
                              {edit ?
                                <InputField
                                  value={form && form.drop[0] ? form.drop[0].dropDeliverNumber : ""}
                                  onChange={(e) => handlePickDropChange(e, 'drop', 'dropDeliverNumber')}
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
                <LoadDetailsUploadComponent
                    edit={edit}
                    rateConfirmation = {rateConfirmation}
                    proofDelivery = {proofDelivery}
                    accessorialsFiles = {accessorialsFiles}
                    handleFileChange={handleFileChange}
                    rateConfirmationRef={rateConfirmationRef}
                    proofDeliveryRef={proofDeliveryRef}
                    accessorialsRef={accessorialsRef}
                    state={state}
                    rateConFile={form.rateConfirmation}
                    podFile={form.proofDelivery}
                    formAccessorialsFiles={form.accessorialsFiles}
                />
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

              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
          </form>
        </div>
        </LocalizationProvider>
      </Modal>
    </>
  );
};

export default React.memo(LoadDetailModal, () => true);
