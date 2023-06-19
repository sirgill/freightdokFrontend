import CompanyText from "../../Atoms/CompanyText";
import React, {useState} from "react";
import {Box, Button, Grid} from "@mui/material";
import Input from "../../Atoms/form/Input";
import {isEmailValid, isPhoneValid, verticalAlignStyle} from "../../../utils/utils";
import {Link} from "react-router-dom";
import {LOGIN_LINK} from "../../constants";

const Support = () => {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})

    function onSubmit(e) {
        e.preventDefault();
        const {email, dot = '', phoneNumber=''} = formData;
        if (!isEmailValid(email)) {
            setErrors({...errors, email: 'Invalid Email'})
        }
        if(!isPhoneValid(phoneNumber)){
            setErrors({...errors, phoneNumber: 'Invalid Phone Number'})
        }
        if(!Number(dot)){
            setErrors({...errors, dot: 'Invalid DOT#'})
        }
        else {
            alert(JSON.stringify(formData))
        }
    }

    function onChange({name, value}) {
        setFormData({...formData, [name]: value});
        setErrors({...errors, [name]: ''})
    }

    return <section className='login'>
        <Box className='auth-wrapper auth-inner' style={verticalAlignStyle}>
            <CompanyText style={{mb: 3, cursor: 'default'}}/>
            <Grid container component='form' gap={2} onSubmit={onSubmit} sx={{
                '.MuiFormControl-root': {width: '100%'}
            }}>
                <Grid item xs={12}>
                    <Input
                        name={'email'}
                        label={'Email'}
                        onChange={onChange}
                        fullWidth
                        errors={errors}
                        value={formData['email']}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        name={'phoneNumber'}
                        label={'Phone Number'}
                        fullWidth
                        errors={errors}
                        // type='number'
                        value={formData['phoneNumber']}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        name={'dot'}
                        label={'DOT#'}
                        fullWidth
                        errors={errors}
                        value={formData['dot']}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input
                        name={'message'}
                        label={'Message'}
                        fullWidth
                        errors={errors}
                        multiline
                        rows={4}
                        value={formData['message']}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item textAlign={'center'} xs={12}>
                    <Button type={'submit'} variant='contained'>Submit</Button>
                </Grid>
                <Grid item textAlign={'center'} xs={12}>
                    <p className="forgot-password text-center">
                        <Link to={LOGIN_LINK}>Sign In</Link>
                    </p>
                </Grid>
            </Grid>
        </Box>
    </section>
}

export default Support;