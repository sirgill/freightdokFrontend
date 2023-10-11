import {modalConfig} from "./config";
import Modal from "../ownerOperator/Modal";
import Input from "../../components/Atoms/form/Input";
import {Button, Grid, Typography} from "@mui/material";
import {memo, useState} from "react";
import {isEmailValid} from "../../utils/utils";
import Password from "../../components/Atoms/form/Password";
import useMutation from "../../hooks/useMutation";
import {AUTH_USER} from "../../config/requestEndpoints";
import LoadingButton from "@mui/lab/LoadingButton";
import {PRIMARY_BLUE} from "../../components/layout/ui/Theme";

const AuthForm = memo(({onChange, form, onSubmit, errors, loading}) => {
    const {password, email} = form;
    return <Grid container spacing={3} direction='column' sx={{minWidth: 350}} component='form' onSubmit={onSubmit}
                 noValidate>
        <Grid item>
            <Typography fontWeight={600} color={PRIMARY_BLUE}>Please verify your credentials.</Typography>
        </Grid>
        <Grid item>
            <Input label='Email' fullWidth type='email' value={email} name='email' onChange={onChange} errors={errors}/>
        </Grid>
        <Grid item>
            <Password label='Password' fullWidth value={password} name='password' onChange={onChange} errors={errors}/>
        </Grid>
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
            <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
            >
                {loading ? 'Please wait...' : 'Verify'}
            </LoadingButton>
        </Grid>
    </Grid>
})

const IntegrationsForm = () => {
    const [form, setForm] = useState({});
    const [isAuthorised, setIsAuthorised] = useState(false);
    const [authForm, setAuthForm] = useState({});
    const [errors, setErrors] = useState({});
    const {loading: loadingSignIn, mutation: verifyUserAsync} = useMutation(AUTH_USER, null, true)

    const onSubmit = (e) => {
        e.preventDefault();
        const {email, mc, code} = form;
        if (!email) {
            setErrors({...errors, email: 'Please enter Email'});
        }
        if (!code) {
            setErrors({...errors, email: 'Please enter Code'});
        }
        if (!mc) {
            setErrors({...errors, email: 'Please enter MC#'});
            return;
        }
        if (!isEmailValid(email)) {
            return setErrors({...errors, email: 'Invalid Email'});
        } else {
            // save data
        }
    }

    const onAuthChange = ({name, value}) => {
        setAuthForm({...authForm, [name]: value})
        setErrors({...errors, [name]: ''});
    }

    const onAuthSubmit = (e) => {
        e.preventDefault();
        const {email, password} = authForm;
        if (!email) {
            setErrors({...errors, email: 'Please enter Email'});
        }
        if (!password) {
            setErrors({...errors, email: 'Please enter Password'});
            return;
        }
        if (isEmailValid(email)) {
            verifyUserAsync(authForm, null)
                .then(res => {
                    if (res.token) {
                        setIsAuthorised(true);
                    }
                })
        } else {
            setErrors({...errors, email: 'Invalid Email'})
        }
    }

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value})
        setErrors({...errors, [name]: ''});
    }

    if (!isAuthorised) {
        return <Modal config={modalConfig}>
            <AuthForm
                onChange={onAuthChange}
                form={authForm} onSubmit={onAuthSubmit} errors={errors}
                loading={loadingSignIn}
            />
        </Modal>
    }

    return <Modal config={modalConfig}>
        <form noValidate onSubmit={onSubmit}>
            <Grid container spacing={3} direction='column' sx={{minWidth: 350}}>
                <Grid item>
                    <Input
                        fullWidth
                        label='Code'
                        onChange={onChange}
                    />
                </Grid>
                <Grid item>
                    <Input
                        fullWidth
                        label='Email'
                        onChange={onChange}
                    />
                </Grid>
                <Grid item>
                    <Input
                        fullWidth
                        label='MC#'
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button type='submit' variant='contained'>Update</Button>
                </Grid>
            </Grid>
        </form>
    </Modal>
}

export default IntegrationsForm;