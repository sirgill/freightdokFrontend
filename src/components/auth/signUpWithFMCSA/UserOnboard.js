import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { verticalAlignStyle } from "../../../utils/utils";
import CompanyText from "../../Atoms/CompanyText";
import Input from "../../Atoms/form/Input";
import Password from "../../Atoms/form/Password";
import { requestPost } from "../../../utils/request";
import { notification } from "../../../actions/alert";
import { LOGIN_LINK } from "../../constants";
import useMutation from "../../../hooks/useMutation";

const UserOnboard = (props) => {
    const { match: { params: { email } = {} } = {}, history } = props;
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({}),
        {loading, mutation} = useMutation('/api/onBoarding/register');

    useEffect(() => {
        requestPost({ uri: '/api/onBoarding/validateOtp', body: { email }, skipTriggers: false })
            .then((res = {}) => {
                const { success, data } = res || {}
                if (!success) {
                    setFormData({ ...formData, disabled: true });
                    if (!data?.success){
                        notification(data?.message || 'Server Error', 'error');
                        console.error('Server Error')
                    }
                }
            });
    }, []);

    const onChange = ({ name, value }) => {
        setFormData({ ...formData, [name]: value })
        setErrors((errors) => ({ ...errors, [name]: '' }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        let isValid = true;
        debugger
        const { otp, password, firstName = '', lastName = ''} = formData;
        if(!firstName){
            isValid = false;
            setErrors(errors => ({...errors, firstName: 'Please Enter First Name'}));
        }
        if (!otp) {
            isValid = false;
            setErrors(errors => ({ ...errors, otp: 'Please enter OTP' }));
        } else if (String(otp).length !== 6) {
            isValid = false;
            setErrors(errors => ({ ...errors, otp: 'OTP should be of six digits' }));
        }
        if (!password) {
            isValid = false;
            setErrors(errors => ({ ...errors, password: 'Please enter Password' }))
        } else if (password.length < 8) {
            isValid = false;
            return setErrors(errors => ({ ...errors, password: 'Password must be 8 letters' }))
        }
        isValid && mutation({ email, password, otp, firstName: firstName.trim(), lastName: lastName.trim() }, null, afterSubmit);
    }

    const afterSubmit = ({success, data}) => {
        if (success) {
            notification(data.message);
            history.push(LOGIN_LINK);
        }
    }

    return <Grid container className='login'>
        <div className='auth-wrapper auth-inner' style={verticalAlignStyle}>
            <CompanyText />
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} component='form' onSubmit={onSubmit}>
                    <Grid item xs={12}>
                        <Input name='email' value={email} disabled label='Email' fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Input name='firstName' required errors={errors} value={formData['firstName']} label='First Name' fullWidth trimValue onChange={onChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <Input name='lastName' value={formData['lastName']} label='Last Name' onChange={onChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Input fullWidth name='otp' required errors={errors} type='number' inputProps={{ max: 999999 }} value={formData['otp']} label='OTP' placeholder='Enter OTP' onChange={onChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <Password name='password' required errors={errors} value={formData['password']} onChange={onChange} />
                    </Grid>
                    <Grid item textAlign='center' xs={12}>
                        <Button type='submit' variant='contained' disabled={formData['disabled'] || loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    </Grid>
}

export default UserOnboard;