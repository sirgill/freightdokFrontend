import {Dialog, DialogContent, DialogTitle, Grid, makeStyles, Typography} from "@material-ui/core";
import React, {Fragment, useEffect, useState} from "react";
import _ from 'lodash';
import {ArrowBack, ArrowForward} from "@material-ui/icons";
import {addWarehouse, getGeoLocation, getWarehouseById, getWarehouses} from "../../actions/warehouse";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import InputField from "../Atoms/form/InputField";
import {Button, Form as ReactForm} from "reactstrap";
import SubmitButton from "../Atoms/form/SubmitButton";

const useStyles = makeStyles((theme) => ({
    backButton: {
        marginRight: theme.spacing(1),
    },
    formTitle: {
        textAlign: 'center',
        padding: theme.spacing(3),
        color: '#4691FF'
    },
    errorText: {
        color: 'red'
    },
    submitButton: {
        textTransform: 'none',
    },
    form: {
        width: 450,
        padding: theme.spacing(2)
    }
}));

const PageTwoForm = ({setData2, setPage, data, classes, getLocation}) => {

    const handleChange = (e) => {
        const {target: {name, value}} = e;
        setData2((prevState) => ({...prevState, [name]: value}));
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <InputField
                label='Phone'
                name='phone'
                fullWidth
                onChange={handleChange}
                value={data['phone']}
            />
            <InputField
                name='parking'
                onChange={handleChange}
                label='Parking'
                type={'select'}
                value={data['parking']}
                options={[{label: 'Yes', value: true}, {label: 'No', value: false}]}
                labelKey={'label'}
                valueKey={'value'}
            />
            <InputField
                label='Appointment'
                name='appointment'
                fullWidth
                onChange={handleChange}
                value={data['appointment']}
            />
            <InputField
                label='Warehouse Hours of Service'
                name='serviceHours'
                fullWidth
                onChange={handleChange}
                value={data['serviceHours']}
            />
            <InputField
                name='restroom'
                onChange={handleChange}
                label='Restroom'
                type={'select'}
                value={data['restroom']}
                options={[{label: 'Yes', value: true}, {label: 'No', value: false}]}
                labelKey={'label'}
                valueKey={'value'}
            />
            <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h6'>Facility Location</Typography>
                <Button onClick={getLocation} className='font-14' color="success">Get Location</Button>
            </Grid>
            <InputField
                label='Latitude'
                name='latitude'
                fullWidth
                onChange={handleChange}
                value={data['latitude']}
            />
            <InputField
                label='Longitude'
                name='longitude'
                fullWidth
                onChange={handleChange}
                value={data['longitude']}
            />
            <Grid item justifyContent='space-between' alignItems='center' style={{marginTop: 10, display: 'flex'}}
                  xs={12}>
                <ArrowBack onClick={() => setPage(1)}
                           style={{color: '#1891FC', height: 25, width: 25, cursor: 'pointer'}}/>
                <SubmitButton type='submit' color='primary' className={classes.submitButton}>Submit</SubmitButton>
            </Grid>
        </div>
    )
}

const FormBody = ({id = null}) => {
    const classes = useStyles();
    const [data, setData] = useState({name: '', address: '', city: '', state: '', zip: '',}),
        [data2, setData2] = useState({
            restroom: true,
            parking: false,
            phone: '',
            appointment: '',
            serviceHours: '',
            latitude: '',
            longitude: ''
        }),
        [errors, setErrors] = useState(''),
        [page, setPage] = useState(1),
        history = useHistory(),
        dispatch = useDispatch(),
        {location: {data: {lat = 0, lng = 0} = {}} = {}} = useSelector(state => state.warehouse);

    const onChange = (e) => {
        const {target: {name, value}} = e;
        setData((prevState) => ({...prevState, [name]: value}));
        setErrors('')
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (id) {
            dispatch(addWarehouse(_.extend(data, data2, {_id: id}), afterSubmit))
        } else dispatch(addWarehouse(_.extend(data, data2), afterSubmit))
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
        dispatch(getGeoLocation({...data}))
    }

    const initializeForm = (response = {}) => {
        let form1 = {...data}
        for (let key in form1) {
            form1[key] = response[key] || '';
        }
        setData(form1);
        let form2 = {...data2}
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
            setData2({...data2, latitude: lat, longitude: lng})
        }
    }, [lat, lng])

    return (
        <ReactForm onSubmit={onSubmit} className={classes.form} autoComplete="off">

            {page === 1 && <Fragment>
                <InputField
                    label='Facility Name'
                    name='name'
                    fullWidth
                    onChange={onChange}
                    required={true}
                    autoCapitalize
                    value={data['name']}
                />
                <InputField
                    label='Address'
                    name='address'
                    fullWidth
                    onChange={onChange}
                    required
                    value={data['address']}
                />
                <InputField
                    label='City'
                    name='city'
                    fullWidth
                    onChange={onChange}
                    required
                    value={data['city']}
                />
                <InputField
                    label='State'
                    name='state'
                    fullWidth
                    onChange={onChange}
                    required
                    value={data['state']}
                />
                <InputField
                    label='Zip'
                    name='zip'
                    fullWidth
                    onChange={onChange}
                    required
                    value={data['zip']}
                />
                {!!errors && <Grid item xs={12}>
                    <Typography className={classes.errorText} align='center' color='red'>{errors}</Typography>
                </Grid>}
                <Grid item style={{marginTop: 10, textAlign: 'right'}} xs={12}>
                    <ArrowForward onClick={validateFields}
                                  style={{color: '#1891FC', height: 25, width: 25, cursor: 'pointer'}}/>
                </Grid>

            </Fragment>}
            {page === 2 && <PageTwoForm getLocation={getLocation} setData2={setData2} setPage={setPage} data={data2}
                                        classes={classes}/>}

        </ReactForm>
    )
}

const Form = (props = {}) => {
    const classes = useStyles(),
        {match: {params: {id = null} = {}} = {}, history} = props;
    return (
        <Dialog maxWidth='sm' onClose={() => history.push('/dashboard')} aria-labelledby="customized-dialog-title" open>
            <DialogTitle className={classes.formTitle} id="dialog-title" onClose={() => null}>
                {id ? 'Edit' : 'Add'} Facility
            </DialogTitle>
            <DialogContent dividers>
                <FormBody id={id}/>
            </DialogContent>
        </Dialog>
    )
}

export default Form;