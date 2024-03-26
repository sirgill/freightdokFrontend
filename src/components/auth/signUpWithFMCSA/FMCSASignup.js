import CompanyText from "../../Atoms/CompanyText";
import { Link, Redirect } from "react-router-dom";
import {FEDERAL_SIGNUP_LINK, LOGIN_LINK, SIGNUP_SUPPORT} from "../../constants";
import { Box, Button, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import Input from "../../Atoms/form/Input";
import { getCheckStatusIcon, isEmailValid, isPhoneValid, textFormatter, verticalAlignStyle } from "../../../utils/utils";
import { requestPost } from "../../../utils/request";
import { notification } from "../../../actions/alert";

export const SuccessComponent = () => {
    const icon = getCheckStatusIcon(true);
    return <Stack justifyContent='center' gap={1} flex={1}>
        <Typography align='center'>{icon}</Typography>
        <Typography align={'center'} sx={{ fontWeight: 550 }}>Thanks for Signing up!</Typography>
        <Typography align={'center'} variant='subtitle2'>Our team will review and contact you :)</Typography>
    </Stack>
}

const FMCSASignup = (props) => {
    const [form, setForm] = useState({})
    const [error, setError] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const { location: { state = {} } = {} } = props,
        { content: { carrier = {} } = {} } = state,
        { legalName, allowedToOperate, dotNumber, phyCity, phyState, phyZipcode, phyCountry, telephone } = carrier || {};

    if (!state) {
        return <Redirect to={FEDERAL_SIGNUP_LINK} />
    }

    async function onSubmit(e) {
        e.preventDefault();
        const { email, phoneNumber } = form;
        if (!isPhoneValid(phoneNumber)) {
            setError(error => ({ ...error, phoneNumber: 'Invalid Phone Number' }))
        }
        else if (!isEmailValid(email)) {
            setError(error => ({ ...error, email: "Invalid Email" }));
        } else {
            const body = { email, phoneNumber: '+1' + phoneNumber, dot: dotNumber, fmcsaDetails: state.content }
            const { success, data } = await requestPost({ uri: '/api/onBoarding', body })
            if (success) {
                setIsSuccess(true);
            } else {
                notification(data.message || 'Network Error', 'error')
            }
        }
    }

    function onChange({ name, value }) {
        setForm({ ...form, [name]: value });
        setError((error) => ({ ...error, [name]: '' }))
    }

    return (
        <div className={'auth-wrapper auth-inner'} style={verticalAlignStyle}>
            <CompanyText style={{ mb: 3, cursor: 'default' }} />
            {isSuccess ? <SuccessComponent /> : <Grid container spacing={2} sx={{
                flex: 1,
                '& p': {
                    color: '#868686',
                    fontSize: 14
                }
            }}>
                <Grid item xs={12}>
                    <Typography>Company: {textFormatter(legalName)}</Typography>
                    <Typography>DOT#: {textFormatter(dotNumber)}</Typography>
                    <Typography>Active Authority: {textFormatter(allowedToOperate)}</Typography>
                    <Typography>City: {textFormatter(phyCity)}</Typography>
                    <Typography>State: {textFormatter(phyState)}</Typography>
                    <Typography>Zip: {textFormatter(phyZipcode)}</Typography>
                    <Typography>Country: {textFormatter(phyCountry)}</Typography>
                    <Typography>Telephone: {textFormatter(telephone)}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Stack component='form' justifyContent='center' onSubmit={onSubmit} gap={2}>
                        <Input label='Phone Number' value={form['phoneNumber']} name='phoneNumber' onChange={onChange}
                            errors={error} placeholder='Please enter the Phone number'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+1</InputAdornment>
                            }}
                        />
                        <Input label='Email' value={form['email']} name='email' errors={error} onChange={onChange}
                            placeholder='Please enter the Email' />
                        <Box textAlign='center'>
                            <Button type='submit' variant='contained'>Submit</Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>}
            <Grid container>
                <Grid item xs={12}>
                    <Typography className="forgot-password text-center">
                        <Link to={SIGNUP_SUPPORT}>Contact Support</Link>
                    </Typography>
                    <Typography className="forgot-password text-center">
                        <Link to={LOGIN_LINK}>Sign In</Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default FMCSASignup