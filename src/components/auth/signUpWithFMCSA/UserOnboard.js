import {Box, Button, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {verticalAlignStyle} from "../../../utils/utils";
import CompanyText from "../../Atoms/CompanyText";
import Input from "../../Atoms/form/Input";
import Password from "../../Atoms/form/Password";
import {requestPost} from "../../../utils/request";
import {notification} from "../../../actions/alert";
import {LOGIN_LINK} from "../../constants";

const UserOnboard = (props) => {
    const {match: {params: {email} = {}} = {}, history} = props;
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        requestPost({uri: '/api/onBoarding/validateOtp', body: {email}})
            .then(res => {
                if(!res.success){
                    setFormData({...formData, disabled: true})
                }
            });
    }, []);

    const onChange = ({name, value}) => {
        setFormData({...formData, [name]: value})
        setErrors((errors) => ({...errors, [name]: ''}));
    }

    async function onSubmit(e) {
        e.preventDefault();
        const {otp, password} = formData;
        if(!otp) {
            setErrors(errors => ({...errors, otp: 'Please enter OTP'}));
        } else if(otp.length !== 6){
            setErrors(errors => ({...errors, otp: 'OTP should be of six digits'}));
        }
        if(!password) {
            setErrors(errors => ({...errors, password: 'Please enter Password'}))
        } else if(password.length < 8){
            return setErrors(errors => ({...errors, password: 'Password must be 8 letters'}))
        }
        const {success, data} = await requestPost(
            {uri: '/api/onBoarding/register', body: {email, password, otp}});
        if(success){
            notification(data.message);
            history.push(LOGIN_LINK);
        }
    }

    return <Grid container className='login'>
        <div className='auth-wrapper auth-inner' style={verticalAlignStyle}>
            <CompanyText/>
            <Box sx={{flex: 1, display: 'flex', alignItems: 'center'}}>
                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                    <Grid item xs={12}>
                        <Input name='email' value={email} disabled label='Email'/>
                    </Grid>
                    <Grid item xs={12}>
                        <Input name='otp' errors={errors} type='number' value={formData['otp']} label='OTP' placeholder='Enter OTP' onChange={onChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Password name='password' errors={errors} value={formData['password']} onChange={onChange} />
                    </Grid>
                    <Grid item textAlign='center' xs={12}>
                        <Button type='submit' variant='contained' disabled={formData['disabled']}>Submit</Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    </Grid>
}

export default UserOnboard;