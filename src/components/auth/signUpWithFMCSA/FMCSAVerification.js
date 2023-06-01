import CompanyText from "../../Atoms/CompanyText";
import {Link, Redirect} from "react-router-dom";
import {FEDERAL_SIGNUP_LINK, LOGIN_LINK} from "../../constants";
import {Grid, Typography} from "@mui/material";
import InputField from "../../Atoms/form/InputField";
import React from "react";

const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const FMCSAVerification = (props) => {
    const {location: {state = {}} = {}} = props,
        {content: {carrier = {}} = {}} = state,
        {legalName, allowedToOperate, dotNumber, phyCity, phyState, phyZipcode, phyCountry, telephone} = carrier || {};

    if (!state) {
        <Redirect to={FEDERAL_SIGNUP_LINK}/>
    }

    console.log(state)

    return (
        <div className={'auth-wrapper auth-inner'} style={verticalAlignStyle}>
            <CompanyText style={{mb: 3, cursor: 'default'}}/>
            <Grid container spacing={2} sx={{
                '& p': {
                    color: '#868686',
                    fontSize: 14
                }
            }}>
                <Grid item xs={12}>
                    <Typography>Company: {legalName}</Typography>
                    <Typography>DOT#: {dotNumber}</Typography>
                    <Typography>Active Authority: {allowedToOperate}</Typography>
                    <Typography>City: {phyCity}</Typography>
                    <Typography>State: {phyState}</Typography>
                    <Typography>Zip: {phyZipcode}</Typography>
                    <Typography>Country: {phyCountry}</Typography>
                    <Typography>Telephone: {telephone}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography align='center'>Enter the code we sent you</Typography>
                    <Typography align='center'>Your phone ({telephone}) will be used to protect your account</Typography>
                    <InputField/>
                </Grid>
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