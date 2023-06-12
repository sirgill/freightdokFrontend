import CompanyText from "../../Atoms/CompanyText";
import {Link, Redirect} from "react-router-dom";
import {FEDERAL_SIGNUP_LINK, LOGIN_LINK} from "../../constants";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import InputField from "../../Atoms/form/InputField";
import React, {useState} from "react";
import {getCheckStatusIcon, textFormatter} from "../../../utils/utils";

const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const SuccessComponent = () => {
    const icon = getCheckStatusIcon(true);
    return <Stack justifyContent='center' gap={1} flex={1}>
        <Typography align='center'>{icon}</Typography>
        <Typography align={'center'} sx={{fontWeight: 550}}>Thanks for Signing up!</Typography>
        <Typography align={'center'} variant='subtitle2'>Our team will review and contact you :)</Typography>
    </Stack>
}

const FMCSAVerification = (props) => {
    const [number, setNumber] = useState();
    const [error, setError] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const {location: {state = {}} = {}} = props,
        {content: {carrier = {}} = {}} = state,
        {legalName, allowedToOperate, dotNumber, phyCity, phyState, phyZipcode, phyCountry, telephone} = carrier || {};

    if (!state) {
        return <Redirect to={FEDERAL_SIGNUP_LINK}/>
    }


    function onSubmit(e) {
        e.preventDefault();
        if (isNaN(number)) {
            return setError('Number is not valid. Please enter the correct number')
        }
        setIsSuccess(true);
    }

    function onChange(e) {
        setNumber(e.target.value)
        if (error) {
            setError('')
        }
    }

    return (
        <div className={'auth-wrapper auth-inner'} style={verticalAlignStyle}>
            <CompanyText style={{mb: 3, cursor: 'default'}}/>
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
                    {/*<Typography align='center'>Enter the code we sent you</Typography>*/}
                    <Typography align='center'>Please enter the Phone number</Typography>
                    {/*<Typography align='center'>Your phone ({telephone}) will be used to protect your account</Typography>*/}
                    <Stack component='form' justifyContent='center' onSubmit={onSubmit}>
                        <InputField value={number} onChange={onChange} errorText={error}/>
                        <Box textAlign='center'>
                            <Button type='submit' variant='contained'>Submit</Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>}
            <Grid container>
                <Grid item xs={12}>
                    <Typography className="forgot-password text-center">
                        <Link to={'#'}>Contact Support</Link>
                    </Typography>
                    <Typography className="forgot-password text-center">
                        <Link to={LOGIN_LINK}>Sign In</Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default FMCSAVerification