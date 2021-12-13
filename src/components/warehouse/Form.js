import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import _ from 'lodash';
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { addWarehouse, getGeoLocation, getWarehouseById, getWarehouses } from "../../actions/warehouse";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { blue } from "../layout/ui/Theme";

const useStyles = makeStyles((theme) => ({
    backButton: {
        marginRight: theme.spacing(1),
    },
    formTitle: {
        textAlign: 'center'
    },
    errorText: {
        color: 'red'
    },
    submitButton: {
        textTransform: 'none',
        color: blue
    },
    form: {
        padding: theme.spacing(5)
    }
}));

const PageTwoForm = ({ setData2, setPage, data, classes, getLocation }) => {

    const handleChange = (e) => {
        const { target: { name, value } } = e;
        setData2((prevState) => ({ ...prevState, [name]: value }));
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    label='Phone'
                    name='phone'
                    fullWidth
                    onChange={handleChange}
                    value={data['phone']}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Parking</InputLabel>
                    <Select
                        name='parking'
                        onChange={handleChange}
                        label='Parking'
                        defaultValue={false}
                        value={data['parking']}
                    >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label='Appointment'
                    name='appointment'
                    fullWidth
                    onChange={handleChange}
                    value={data['appointment']}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label='Warehouse Hours of Service'
                    name='serviceHours'
                    fullWidth
                    onChange={handleChange}
                    value={data['serviceHours']}
                />
            </Grid>
            <Grid item xs={12} style={{ mt: 8 }}>
                <FormControl fullWidth>
                    <InputLabel>Restroom</InputLabel>
                    <Select
                        name='restroom'
                        onChange={handleChange}
                        label='Restroom'
                        defaultValue={true}
                        value={data['restroom']}
                    >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ marginTop: 4 }} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6'>Warehouse Location</Typography>
                <Button onClick={getLocation} variant="outlined" color="primary">Get Location</Button>
            </Grid>
            <Grid item xs={6} style={{ mt: 8 }}>
                <TextField
                    label='Latitude'
                    name='latitude'
                    fullWidth
                    onChange={handleChange}
                    value={data['latitude']}
                />
            </Grid>
            <Grid item xs={6} style={{ mt: 8 }}>
                <TextField
                    label='Longitude'
                    name='longitude'
                    fullWidth
                    onChange={handleChange}
                    value={data['longitude']}
                />
            </Grid>
            <Grid item style={{ marginTop: 10, textAlign: 'center' }} xs={12}>
                <Button type='submit' variant='outlined' className={classes.submitButton}>Submit</Button>
            </Grid>
            <Grid item style={{ marginTop: 10, textAlign: 'left' }} xs={1}>
                <ArrowBack onClick={() => setPage(1)} style={{ color: '#1891FC', height: 25, width: 25, cursor: 'pointer' }} />
            </Grid>
        </Grid>
    )
}

const FormBody = ({ id = null }) => {
    const classes = useStyles();
    const [data, setData] = useState({ name: '', address: '', city: '', state: '', zip: '', }),
        [data2, setData2] = useState({ restroom: true, parking: false, phone: '', appointment: '', serviceHours: '', latitude: '', longitude: '' }),
        [errors, setErrors] = useState(''),
        [page, setPage] = useState(1),
        history = useHistory(),
        dispatch = useDispatch(),
        { location: { data: { lat = 0, lng = 0 } = {} } = {} } = useSelector(state => state.warehouse);

    const onChange = (e) => {
        const { target: { name, value } } = e;
        setData((prevState) => ({ ...prevState, [name]: value }));
        setErrors('')
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (id) {
            dispatch(addWarehouse(_.extend(data, data2, { _id: id }), afterSubmit))
        }
        else dispatch(addWarehouse(_.extend(data, data2), afterSubmit))
    }

    const afterSubmit = () => {
        dispatch(getWarehouses());
        history.push('/dashboard')
    }

    const validateFields = () => {
        if (!_.isEmpty(data)) {
            for (let key in data) {
                if (!data[key] || _.isBoolean(data[key]))
                    return setErrors('Please fill all the fields')
            }
        }
        setPage(2);
    }

    const getLocation = () => {
        dispatch(getGeoLocation({ ...data }))
    }

    const initializeForm = (response = {}) => {
        let form1 = { ...data }
        for (let key in form1) {
            form1[key] = response[key] || '';
        }
        setData(form1);
        let form2 = { ...data2 }
        for (let key in data2) {
            form2[key] = _.isBoolean(response[key]) ? Boolean(response[key]) : response[key] || '';
        }
        setData2(form2)
    }

    useEffect(() => {
        if (id) {
            dispatch(getWarehouseById(id, initializeForm))
        }
    }, [])

    useEffect(() => {
        if (lat && lng) {
            setData2({ ...data2, latitude: lat, longitude: lng })
        }
    }, [lat, lng])

    return (
        <form onSubmit={onSubmit} className={classes.form} autoComplete="off">
            <Grid container spacing={2}>
                {page === 1 && <Fragment>
                    <Grid item xs={12}>
                        <TextField
                            label='Name'
                            name='name'
                            fullWidth
                            onChange={onChange}
                            required={true}
                            autoCapitalize
                            value={data['name']}
                            defaultValue='dfds'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Address'
                            name='address'
                            fullWidth
                            onChange={onChange}
                            required
                            value={data['address']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='City'
                            name='city'
                            fullWidth
                            onChange={onChange}
                            required
                            value={data['city']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='State'
                            name='state'
                            fullWidth
                            onChange={onChange}
                            required
                            value={data['state']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Zip'
                            name='zip'
                            fullWidth
                            onChange={onChange}
                            required
                            value={data['zip']}
                        />
                    </Grid>
                    {!!errors && <Grid item xs={12}>
                        <Typography className={classes.errorText} align='center' color='red'>{errors}</Typography>
                    </Grid>}
                    <Grid item style={{ marginTop: 10, textAlign: 'right' }} xs={12}>
                        <ArrowForward onClick={validateFields} style={{ color: '#1891FC', height: 25, width: 25, cursor: 'pointer' }} />
                    </Grid>

                </Fragment>}
                {page === 2 && <PageTwoForm getLocation={getLocation} setData2={setData2} setPage={setPage} data={data2} classes={classes} />}
            </Grid>
        </form>
    )
}

const Form = (props = {}) => {
    const classes = useStyles(),
        { match: { params: { id = null } = {} } = {}, history } = props;
    return (
        <Dialog maxWidth='sm' onClose={() => history.push('/dashboard')} aria-labelledby="customized-dialog-title" open>
            <DialogContent dividers>
                <DialogTitle className={classes.formTitle} id="customized-dialog-title" onClose={() => null}>
                    Warehouse
                </DialogTitle>
                <FormBody id={id} />
            </DialogContent>
        </Dialog>
    )
}

export default Form;