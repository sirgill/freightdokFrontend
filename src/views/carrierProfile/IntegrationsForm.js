import {memo, useState} from "react";
import {Button, Grid, Typography} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "../ownerOperator/Modal";

import {modalConfig} from "./config";
import {isEmailValid, triggerCustomEvent} from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import {AUTH_USER} from "../../config/requestEndpoints";
import {PRIMARY_BLUE} from "../../components/layout/ui/Theme";
import {Input, Password} from "../../components/Atoms";

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

const IntegrationsForm = (props) => {
    const {state: {row, rowIndex, list} = {}} = props.location;
    const [form, setForm] = useState({email: '', mc: '', code: ''});
    const [isAuthorised, setIsAuthorised] = useState(false);
    const [authForm, setAuthForm] = useState({email: '', password: ''});
    const [errors, setErrors] = useState({});
    const {loading: loadingSignIn, mutation: verifyUserAsync} = useMutation(AUTH_USER, null, true)
    const {loading: isSaving, mutation: updateMutation} = useMutation('/api/carrierProfile/secret-manager?update=true', null, true)

    const onSubmit = (e) => {
        e.preventDefault();
        const {email, mc, code} = form;
        if (!isEmailValid(email) || !email) {
            return setErrors({...errors, email: 'Invalid Email'});
        } else {
            // save data
            const item = list[rowIndex]
            const integrationName = item['integrationName'];
            const obj = {
                [integrationName]: form['code'],
                mc: form.mc,
                email: form.email
            }
            list.forEach(item => {
                if(item.integrationName !== integrationName){
                    Object.assign(obj, {[item.integrationName]: item.code})
                }
            })

            updateMutation(obj)
                .then(res => {
                    console.log(res);
                    triggerCustomEvent('fetchCarrierProfile');
                    triggerCustomEvent('closeModal')
                })
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
                        setForm(row)
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
                        name='code'
                        onChange={onChange}
                        value={form.code || ''}
                    />
                </Grid>
                <Grid item>
                    <Input
                        fullWidth
                        label='Email'
                        onChange={onChange}
                        name={'email'}
                        value={form.email || ''}
                    />
                </Grid>
                <Grid item>
                    <Input
                        fullWidth
                        label='MC#'
                        name='mc'
                        onChange={onChange}
                        value={form.mc || ''}
                    />
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isSaving}
                    >
                        {isSaving ? 'Updating...' : 'Update'}
                    </LoadingButton>
                </Grid>
            </Grid>
        </form>
    </Modal>
}

export default IntegrationsForm;