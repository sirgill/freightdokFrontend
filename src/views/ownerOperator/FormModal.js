import DialogTitle from "@mui/material/DialogTitle";
import _ from 'lodash';
import { blue } from "../../components/layout/ui/Theme";
import Grid from '@mui/material/Grid'
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import { notification } from "../../actions/alert";
import { isEmailValid, triggerCustomEvent } from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import {Input, LoadingButton, Password} from "../../components/Atoms";
import useLazyFetch from "../../hooks/useLazyFetch";

const validateForm = ({ firstName, lastName, phone, email, password, confirmPassword }, id) => {
    let errors = {}
    if (!firstName) {
        errors.firstName = 'Please provide the First Name'
    }
    if (!lastName) {
        errors.lastName = 'Please provide the Last Name'
        // return [false, 'Please provide the Last Name', 'lastName']
    }
    if (!phone) {
        errors.phone = 'Please provide the Phone Number'
    }
    if (!email) {
        errors.email = 'Please provide the Email'
    }
    if (!isEmailValid(email)) {
        errors.email = 'Invalid Email'
    }
    if(!id && !password){
        errors.password = 'Please enter Password'
    }
    if(!id && !confirmPassword){
        errors.confirmPassword = 'Please enter Confirm Password'
    }
    else if(!id && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match. Try again'
    }
    return errors
}
const formTemplate = {
    firstName: "",
    lastName: "",
    phone: "",
    email: '',
    password: '',
    confirmPassword: ''
}


const FormModal = (props) => {
    const { history, match: { params: { id = '' } = {} } = {}, onCloseUrl } = props;
    const [form, setForm] = React.useState(formTemplate);
    const [errors, setErrors] = useState(formTemplate);
    const { mutation, loading } = useMutation("/api/ownerOperator"),
        { loading: isFetching, data } = useLazyFetch("/api/ownerOperator/" + id, { lazyFetchCondition: !!id }),
        { data: ownerOpData } = data || {};

    const updateForm = ({ name, value }) => {
        setForm({ ...form, [name]: value });
    }

    useEffect(() => {
        if (ownerOpData) {
            setForm(ownerOpData);
        }
    }, [ownerOpData])

    const onBlur = ({ name, value }) => {
        if (value) {
            setErrors({ ...errors, [name]: '' });
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const body = { ...form };
        const errors = validateForm(body, id);
        if (_.isEmpty(errors)) {
            if(id){
                delete body.confirmPassword;
                delete body.password
            }
            mutation({...body, _id: id}, null, afterSubmit);
        } else {
            setErrors({ ...errors })
        }
    };

    const afterSubmit = ({ success, data }) => {
        const { message } = data || {};
        if (success) {
            triggerCustomEvent('refreshOwnerOp');
            notification(message || 'Owner operator created');
            handleClose();
        } else {
            notification(message, 'error');
        }
    }

    const handleClose = () => {
        history.push(onCloseUrl);
    }
    return (
        <Dialog
            fullWidth={false}
            maxWidth={"md"}
            open={true}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            PaperProps={{
                sx: {
                    width: 400
                }
            }}
        >
            <DialogTitle id="form-dialog-title" sx={{
                color: blue,
                textAlign: 'center',
                fontWeight: 400,
                letterSpacing: 1
            }}>
                {id ? "Edit" : 'Add'} Owner Operator
            </DialogTitle>
            <DialogContent>
                <Grid container component='form' noValidate direction='column' rowSpacing={3} p={1}>
                    <Grid item xs={12}>
                        <div>
                            <Input
                                name={"firstName"}
                                label={"First Name"}
                                onChange={updateForm}
                                value={form.firstName || ''}
                                errors={errors}
                                onBlur={onBlur}
                                fullWidth
                                disabled={isFetching || loading}
                                required
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            name={"lastName"}
                            label={"Last Name"}
                            onChange={updateForm}
                            value={form.lastName || ''}
                            errors={errors}
                            onBlur={onBlur}
                            fullWidth
                            disabled={isFetching || loading}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            name={"email"}
                            label={"Email"}
                            onChange={updateForm}
                            value={form.email || ''}
                            errors={errors}
                            onBlur={onBlur}
                            fullWidth
                            disabled={isFetching || loading}
                            required
                        />
                    </Grid>
                    {!id && <Grid xs={12} item>
                        <Password
                            name={'password'}
                            label={'Password'}
                            onChange={updateForm}
                            fullWidth
                            value={form.password}
                            errors={errors}
                            onBlur={onBlur}
                            disabled={isFetching || loading}
                        />
                    </Grid>}
                    {!id && <Grid xs={12} item>
                        <Password
                            name={'confirmPassword'}
                            label={'Confirm Password'}
                            onChange={updateForm}
                            fullWidth
                            errors={errors}
                            value={form.confirmPassword}
                            onBlur={onBlur}
                            disabled={isFetching || loading}
                        />
                    </Grid>}
                    <Grid item xs={12}>
                        <Input
                            name={"phone"}
                            label={"Phone Number"}
                            onChange={updateForm}
                            value={form.phone || ''}
                            onBlur={onBlur}
                            errors={errors}
                            fullWidth
                            disabled={isFetching || loading}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            fullWidth
                            type="submit"
                            onClick={onSubmit}
                            isLoading={loading || isFetching}
                            loadingText={loading ? 'Updating...' : isFetching ? 'Please wait...' : null}
                            disabled={_.isEqual(ownerOpData, form)}
                        >
                            {id ? 'Update' : 'Add'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default FormModal