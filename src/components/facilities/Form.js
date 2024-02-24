import React, {Fragment, useEffect, useState} from "react";
import _ from "lodash";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {Button, Grid, Typography} from '@mui/material'
import {
    getGeoLocation,
    getWarehouseById,
} from "../../actions/warehouse";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {FACILITIES_LINK} from "../client/routes";
import Modal from "../Atoms/Modal";
import Input from "../Atoms/form/Input";
import {LoadingButton} from "../Atoms";
import Select from "../Atoms/form/Select";
import useMutation from "../../hooks/useMutation";


const PageTwoForm = ({setData2, setPage, data, getLocation, loading}) => {
    const handleChange = ({name, value}) => {
        setData2((prevState) => ({...prevState, [name]: value}));
    };

    return (
        <Grid container sx={{display: "flex", '&>div:not(.select)': {p: 1},}}>
            <Input
                label="Phone"
                name="phone"
                type='number'
                fullWidth
                onChange={handleChange}
                value={data["phone"]}
                className='inputField'
            />
            <Grid item xs={12}>
                <Select
                    name="parking"
                    onChange={handleChange}
                    label="Parking"
                    type={"select"}
                    value={data["parking"]}
                    options={[
                        {label: "Yes", value: true},
                        {label: "No", value: false},
                    ]}
                    labelKey={"label"}
                    valueKey={"value"}
                />
            </Grid>
            <Grid item xs={12}>
                <Select
                    label="Appointment"
                    name="appointment"
                    fullWidth
                    onChange={handleChange}
                    value={data["appointment"]}
                    options={[
                        {label: "Yes", value: true},
                        {label: "No", value: false},
                    ]}
                    type={"select"}
                    labelKey={"label"}
                    valueKey={"value"}
                />
            </Grid>
            <Grid item xs={12}>
                <Select
                    label="FCFS"
                    name="fcfs"
                    fullWidth
                    onChange={handleChange}
                    value={data["fcfs"]}
                    options={[
                        {label: "Yes", value: true},
                        {label: "No", value: false},
                    ]}
                    type={"select"}
                    labelKey={"label"}
                    valueKey={"value"}
                />
            </Grid>
            <Input
                label="Facilities Hours of Service"
                name="serviceHours"
                fullWidth
                onChange={handleChange}
                value={data["serviceHours"]}
                className='inputField'
            />
            <Grid item xs={12}>
                <Select
                    name="restroom"
                    onChange={handleChange}
                    label="Restroom"
                    type={"select"}
                    value={data["restroom"]}
                    options={[
                        {label: "Yes", value: true},
                        {label: "No", value: false},
                    ]}
                    labelKey={"label"}
                    valueKey={"value"}
                />
            </Grid>
            <Grid
                item
                xs={12}
                style={{display: "flex", justifyContent: "space-between"}}
            >
                <Typography variant="h6">Facility Location</Typography>
                <Button onClick={getLocation} className="font-14" color="success" variant='outlined'>
                    Get Location
                </Button>
            </Grid>
            <Input
                label="Latitude"
                name="latitude"
                fullWidth
                onChange={handleChange}
                value={data["latitude"]}
                className='inputField'
            />
            <Input
                label="Longitude"
                name="longitude"
                fullWidth
                onChange={handleChange}
                value={data["longitude"]}
                className='inputField'
            />
            <Grid
                item
                justifyContent="space-between"
                alignItems="center"
                style={{marginTop: 10, display: "flex"}}
                xs={12}
            >
                <ArrowBack
                    onClick={() => setPage(1)}
                    style={{color: "#1891FC", height: 25, width: 25, cursor: "pointer"}}
                />
                <LoadingButton
                    type="submit"
                    color="primary"
                    isLoading={loading}
                    loadingText='Saving...'
                >
                    Save
                </LoadingButton>
            </Grid>
        </Grid>
    );
};

const FormBody = ({id = null, mutation, loading, refetch}) => {
    const [data, setData] = useState({
            name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
        }),
        [data2, setData2] = useState({
            restroom: true,
            parking: false,
            phone: "",
            appointment: false,
            serviceHours: "",
            latitude: "",
            longitude: "",
            fcfs: false,
        }),
        [errors, setErrors] = useState(""),
        [page, setPage] = useState(1),
        history = useHistory(),
        dispatch = useDispatch(),
        {location: {data: {lat = 0, lng = 0} = {}} = {}} = useSelector(
            (state) => state.warehouse
        );

    const onChange = ({name, value}) => {
        setData((prevState) => ({...prevState, [name]: value}));
        setErrors("");
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (id) {
            const form2 = data2
            form2.fcfs = !!form2.fcfs;
            form2.appointment = !!form2.appointment
            form2.parking = !!form2.parking
            form2.restroom = !!form2.restroom
            mutation(_.extend(data, form2, {_id: id}), null, afterSubmit);
        } else {
            mutation(_.extend(data, data2), null, afterSubmit);
        }
    };

    const afterSubmit = () => {
        refetch();
        history.push(FACILITIES_LINK);
    };

    const validateFields = () => {
        if (!_.isEmpty(data)) {
            for (let key in data) {
                if (!data[key] || _.isBoolean(data[key]))
                    return setErrors("Please fill all the fields");
            }
        }
        setPage(2);
    };

    const getLocation = () => {
        dispatch(getGeoLocation({...data}));
    };

    const initializeForm = (response = {}) => {
        let form1 = {...data};
        for (let key in form1) {
            form1[key] = response[key] || "";
        }
        setData(form1);
        let form2 = {...data2};
        for (let key in data2) {
            form2[key] = _.isBoolean(response[key])
                ? Boolean(response[key])
                : response[key] || "";
        }
        setData2(form2);
    };

    useEffect(() => {
        if (id) {
            dispatch(getWarehouseById(id, initializeForm));
        }
    }, []);

    useEffect(() => {
        if (lat && lng) {
            setData2({...data2, latitude: lat, longitude: lng});
        }
    }, [lat, lng]);

    return (
        <Grid container onSubmit={onSubmit} sx={{width: 350, '&>div': {p: 1}}} autoComplete="off" component={'form'}>
            {page === 1 && (
                <Fragment>
                    <Input
                        label="Facility Name"
                        name="name"
                        fullWidth
                        onChange={onChange}
                        required={true}
                        autoCapitalize
                        value={data["name"]}
                    />
                    <Input
                        label="Address"
                        name="address"
                        fullWidth
                        onChange={onChange}
                        required
                        value={data["address"]}
                    />
                    <Input
                        label="City"
                        name="city"
                        fullWidth
                        onChange={onChange}
                        required
                        value={data["city"]}
                    />
                    <Input
                        label="State"
                        name="state"
                        fullWidth
                        onChange={onChange}
                        required
                        value={data["state"]}
                    />
                    <Input
                        label="Zip"
                        name="zip"
                        fullWidth
                        onChange={onChange}
                        required
                        value={data["zip"]}
                    />
                    {!!errors && (
                        <Grid item xs={12}>
                            <Typography
                                align="center"
                                color="red"
                            >
                                {errors}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item style={{marginTop: 10, textAlign: "right"}} xs={12}>
                        <ArrowForward
                            onClick={validateFields}
                            style={{
                                color: "#1891FC",
                                height: 25,
                                width: 25,
                                cursor: "pointer",
                            }}
                        />
                    </Grid>
                </Fragment>
            )}
            {page === 2 && (
                <PageTwoForm
                    getLocation={getLocation}
                    setData2={setData2}
                    setPage={setPage}
                    data={data2}
                    loading={loading}
                />
            )}
        </Grid>
    );
};

const Form = (props = {}) => {
    const {match: {params: {id = null} = {}} = {}, refetch} = props;
    const {mutation, loading} = useMutation('/api/warehouse')

    const config = {
        title: (id ? "Edit" : "Add") + ' Facility',
        closeUrl: FACILITIES_LINK,
        preventBackdropClick: true
    }

    return (
        <Modal config={config}>
            <FormBody id={id} mutation={mutation} loading={loading} refetch={refetch} />
        </Modal>
    )
};

export default Form;
