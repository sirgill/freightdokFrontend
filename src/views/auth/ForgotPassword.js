import {Grid, InputAdornment, Typography} from "@mui/material";
import {MailOutline} from "@mui/icons-material";
import {Input, LoadingButton, Password} from "../../components/Atoms";
import {isEmailValid, verticalAlignStyle} from "../../utils/utils";
import {useState} from "react";
import AuthContainer from "../../components/common/AuthContainer";
import CompanyText from "../../components/Atoms/CompanyText";
import useMutation from "../../hooks/useMutation";
import {Link} from "react-router-dom";
import {LOGIN_LINK} from "../../components/client/routes";
import {notification} from "../../actions/alert";
import {validatePasswordsPreLogin} from "./utils";
import OTPInput from "../../components/Atoms/form/OTPInput";

const ChangePasswordForm = ({form, onChange, loading, errors}) => {
    return <>
        <Grid item xs={12}>
            {/*<Input type='number' label='OTP' onChange={onChange} value={form.otp} name='otp' errors={errors}/>*/}
            <OTPInput length={6} onChange={onChange} name='otp' errors={errors} />
        </Grid>
        <Grid item xs={12}>
            <Password label='New Password' onChange={onChange} value={form.pass} name='pass' errors={errors}/>
        </Grid>
        <Grid item xs={12}>
            <Password label='Confirm Password' onChange={onChange} value={form.confirmPass} name='confirmPass'
                      errors={errors} autoComplete={'false'}/>
        </Grid>
        <Grid item xs={12} sx={{m: 'auto'}}>
            <LoadingButton isLoading={loading} type='submit' loadingText='Please wait...'>Submit</LoadingButton>
        </Grid>
        <Grid item xs={12} sx={{m: 'auto'}}>
            <Typography component={Link} to={LOGIN_LINK} sx={{display: 'block'}}>Sign In</Typography>
        </Grid>
    </>
}
const ForgotPassword = ({history}) => {
    const [form, setForm] = useState({pass: '', confirmPass: '', email: '', otp: ''}),
        [errors, setErrors] = useState({pass: '', confirmPass: '', email: '', otp: ''}),
        [isOtpSent, setIsOtpSent] = useState(false),
        [alert, setAlert] = useState({open: false, message: '', severity: 'error'}),
        {mutation, loading} = useMutation('/api/forgotPassword'),
        {mutation: changePasswordMutation, loading: isChangingPassword} = useMutation('/api/forgotPassword');

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
        setErrors({...errors, [name]: ''})
    }

    const closeAlert = () => {
        setAlert({...alert, open: false});
    }

    const onSubmit = (e) => {
        closeAlert();
        e.preventDefault();
        if (!isOtpSent) {
            if (!isEmailValid(form.email)) {
                return setErrors({...errors, email: 'Please enter valid Email'})
            }
            mutation({email: form.email}, 'post')
                .then(({success, data}) => {
                    notification(data?.message, success ? undefined : 'error');
                    if (success) {
                        setIsOtpSent(true);
                    }
                })
                .catch(err => {
                    notification(err.message, 'error')
                })
        } else {
            const {confirmPass, pass, otp, email} = form;
            const {isValid, err} = validatePasswordsPreLogin({confirmPass, pass, otp});
            if (!isValid) {
                return setErrors(err);
            }
            if (confirmPass !== pass) {
                setAlert({...alert, open: true, message: 'Passwords do not match'})
            } else {
                changePasswordMutation({confirmPass, email, otp, newPass: form.pass}, 'put')
                    .then(({success, data}) => {
                        if (success) {
                            notification(data?.message);
                            history.push(LOGIN_LINK);
                        } else {
                            setAlert({...alert, open: true, message: data.message});
                        }
                    })
                    .catch(err => {
                        debugger
                        notification(err.message, 'error')
                    })
            }
        }
    }

    let comp;
    if (isOtpSent) {
        comp = <ChangePasswordForm form={form} onChange={onChange} loading={isChangingPassword} errors={errors}/>
    } else {
        comp = <>
            <Grid item xs={12}>
                <Input
                    label='Email'
                    onChange={onChange}
                    value={form.email}
                    name='email'
                    errors={errors}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <MailOutline/>
                        </InputAdornment>,
                    }}/>
            </Grid>
            <Grid item xs={12} sx={{m: 'auto'}}>
                <LoadingButton isLoading={loading} type='submit' loadingText='Please wait...'>Verify</LoadingButton>
            </Grid>
        </>
    }

    return <div className='auth-wrapper' style={verticalAlignStyle}>
        <AuthContainer container direction='column' gap={2} px={8} py={4} component={'form'} onSubmit={onSubmit}
                       alertConfig={alert}>
            <Grid item sx={{mb: 3}}>
                <CompanyText style={{pointer: 'default'}}/>
            </Grid>
            {comp}
        </AuthContainer>
    </div>
}

export default ForgotPassword