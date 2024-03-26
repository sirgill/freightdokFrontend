import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Divider } from "@mui/material"
import "date-fns";
import Grid from "@mui/material/Grid";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import {
    useStyles,
} from "../HelperCells";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addLoad } from "../../actions/load";
import AsyncAutoComplete from "../Atoms/AsyncAutoComplete";
import _ from "lodash";
import InputField from "../Atoms/form/InputField";
import { blue } from "../layout/ui/Theme";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

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
        if (e.target.name === "pickupZip") {
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

    const afterSubmit = (isSuccess) => {
        if(isSuccess){
            handleClose()
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        handleNewPickDrop();
        addLoad(form, afterSubmit);
    };

    return (
        <div>
            {(user && user.role === "afterhours") || (
                <Button
                    variant='contained'
                    color="primary"
                    onClick={handleClickOpen}
                    style={{ marginBottom: "20%" }}
                >
                    Add Load
                </Button>
            )}

            <Dialog
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                PaperProps={{
                    sx: {
                        minWidth: 440
                    }
                }}
            >
                <DialogContent>
                    <div className="">
                        <form>
                            {count === 1 ? (
                                <Fragment>
                                    <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center', color: '#32325D' }}>Add
                                        Load</DialogTitle>
                                    <Stack spacing={5} sx={{ width: '100%' }}>
                                        <InputField
                                            name={"brokerage"}
                                            placeholder={"Brokerage"}
                                            onChange={(e) => updateForm(e)}
                                            value={brokerage}
                                            formGrpStyle={{ marginBottom: 0 }}
                                        />
                                        <InputField
                                            name={"loadNumber"}
                                            placeholder={"Load Number"}
                                            onChange={updateForm}
                                            value={loadNumber}
                                        />
                                        <InputField
                                            name={"rate"}
                                            placeholder={"Rate"}
                                            onChange={updateForm}
                                            value={rate}
                                        />
                                    </Stack>
                                </Fragment>
                            ) : null}

                            {count === 2 ? (
                                <div>
                                    <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>Pickup</DialogTitle>
                                    <Stack spacing={3}>
                                        <InputField
                                            name={"shipperName"}
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
                                        <InputField
                                            name={"pickupCity"}
                                            label={"City"}
                                            onChange={updatePickUp}
                                            value={pickUp.pickupCity}
                                        />
                                        <InputField
                                            name={"pickupState"}
                                            label={"State"}
                                            onChange={updatePickUp}
                                            value={pickUp.pickupState}
                                        />
                                        <InputField
                                            name={"pickupZip"}
                                            label={"Zip"}
                                            onChange={updatePickUp}
                                            value={pickUp.pickupZip}
                                            type='number'
                                        />
                                    </Stack>
                                </div>
                            ) : null}

                            {count === 3 ? (
                                <div>
                                    <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>Pickup</DialogTitle>
                                    <Stack spacing={3}>
                                        <div className="form-group" style={{ width: '100%' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    label="Pickup Date"
                                                    format="MM/dd/yyyy"
                                                    value={pickUp.pickupDate}
                                                    onChange={(date) => updateDate(date, 0)}
                                                    renderInput={(params) => <TextField {...params} fullWidth={true} />}
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <div className="form-group" style={{ width: '100%' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <TimePicker
                                                    label="Pickup Time"
                                                    size="small"
                                                    id="time-picker"
                                                    value={pickUp.pickupDate}
                                                    onChange={(date) => updateDate(date, 0)}
                                                    renderInput={(params) => <TextField {...params} fullWidth={true} />}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <InputField
                                            name={"pickupPo"}
                                            label={"PO#"}
                                            onChange={(e) => updatePickUp(e)}
                                            value={pickUp.pickupPo}
                                        />
                                        <InputField
                                            name={"pickupDeliverNumber"}
                                            label={"Delivery#"}
                                            onChange={(e) => updatePickUp(e)}
                                            value={pickUp.pickupDeliverNumber}
                                        />
                                        <InputField
                                            name={"pickupReference"}
                                            label={"Ref#"}
                                            onChange={(e) => updatePickUp(e)}
                                            value={pickUp.pickupReference}
                                        />
                                    </Stack>
                                </div>
                            ) : null}

                            {count === 4 ? (
                                <div>
                                    <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>Drop</DialogTitle>

                                    <Stack spacing={2}>
                                        <div className="form-group">
                                            <InputField
                                                name="receiverName"
                                                label={"Receiver"}
                                                value={dropOff.receiverName}
                                                onChange={(e) => updateDropOff(e)}
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
                                        <InputField
                                            name={"dropCity"}
                                            label={"City"}
                                            onChange={(e) => updateDropOff(e)}
                                            value={dropOff.dropCity}
                                        />
                                        <InputField
                                            name={"dropState"}
                                            label={"State"}
                                            onChange={(e) => updateDropOff(e)}
                                            value={dropOff.dropState}
                                        />
                                        <InputField
                                            name={"dropZip"}
                                            label={"Zip"}
                                            onChange={(e) => updateDropOff(e)}
                                            value={dropOff.dropZip}
                                        />
                                    </Stack>
                                </div>
                            ) : null}

                            {count === 5 ? (
                                <div>
                                    <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>Drop</DialogTitle>
                                    <Stack spacing={2}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Date"
                                                format="MM/dd/yyyy"
                                                value={dropOff.dropDate}
                                                onChange={(date) => updateDate(date, 1)}
                                                renderInput={(params) => <TextField {...params} fullWidth={true} />}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker
                                                margin="normal"
                                                id="time-picker"
                                                label="Time"
                                                value={dropOff.dropDate}
                                                onChange={(date) => updateDate(date, 1)}
                                                renderInput={(params) => <TextField {...params} fullWidth={true} />}
                                            />
                                        </LocalizationProvider>
                                        <InputField
                                            name={"dropPo"}
                                            label={"PO#"}
                                            onChange={(e) => updateDropOff(e)}
                                            value={dropOff.dropPo}
                                        />
                                        <InputField
                                            name={"dropDeliverNumber"}
                                            label={"Delivery#"}
                                            onChange={(e) => updateDropOff(e)}
                                            value={dropOff.dropDeliverNumber}
                                        />
                                        <InputField
                                            name={"dropReference"}
                                            label={"Ref#"}
                                            onChange={(e) => updateDropOff(e)}
                                            value={dropOff.dropReference}
                                        />
                                    </Stack>
                                </div>
                            ) : null}
                        </form>
                    </div>
                </DialogContent>

                <div>
                    <Grid container sx={{ p: 2, pl: 3, pr: 3, justifyContent: count === 1 ? 'right' : 'space-between' }}>
                        {count !== 1 && <Grid item>
                            <ArrowBack
                                style={{
                                    color: blue,
                                    marginTop: "13%",
                                    height: 25,
                                    width: 25,
                                    cursor: "pointer",
                                }}
                                onClick={handleBack}
                            />
                        </Grid>}
                        {count === 5 && <Grid item>
                            <Button
                                className=""
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                            >
                                Submit Load
                            </Button>
                        </Grid>}
                        {count !== 5 && (
                            <Grid item>
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
                            </Grid>
                        )}
                    </Grid>
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
