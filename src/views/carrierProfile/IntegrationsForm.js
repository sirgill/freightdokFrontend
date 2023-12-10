import {memo, useState} from "react";
import {Grid, Typography} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "../../components/Atoms/Modal";

import {modalConfig} from "./config";
import {getUserDetail, isEmailValid, triggerCustomEvent} from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import {AUTH_USER} from "../../config/requestEndpoints";
import {PRIMARY_BLUE} from "../../components/layout/ui/Theme";
import {Alert, Input, Password} from "../../components/Atoms";
import {notification} from "../../actions/alert";

const AuthForm = memo(({onChange, form, onSubmit, errors, loading}) => {
    const {password, email} = form;
    return <Grid container spacing={3} direction='column' sx={{minWidth: 350}} component='form' onSubmit={onSubmit}
                 noValidate>
        <Grid item>
            <Typography fontWeight={600} color={PRIMARY_BLUE}>Please verify your credentials.</Typography>
        </Grid>
        <Grid item>
            <Input readOnly label='Email' fullWidth type='email' value={email} name='email' onChange={onChange} errors={errors}/>
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
    const {state: {row} = {}} = props.location,
        isChrobinson = row.integrationName.equalsIgnoreCase('chrobinson');
    const [form, setForm] = useState({email: '', mc: '', code: ''});
    const [isAuthorised, setIsAuthorised] = useState(false);
    const [authForm, setAuthForm] = useState({email: getUserDetail().user.email, password: ''});
    const [errors, setErrors] = useState({});
    const {loading: loadingSignIn, mutation: verifyUserAsync} = useMutation(AUTH_USER, null, true)
    const {loading: isSaving, mutation: updateMutation} = useMutation('/api/carrierProfile/secret-manager?update=true', null, true)

    const onSubmit = (e) => {
        e.preventDefault();
        const {email, code} = form;
        if (!isEmailValid(email) || !email) {
            return setErrors({...errors, email: 'Invalid Email'});
        } else {
            // save data
            const obj = {
                mc: form.mc,
                email: form.email,
            }
            if(code){
                Object.assign(obj, {code})
            }

            if(isChrobinson){
                const {clientId, clientSecret} = form;
                Object.assign(obj, { clientId, clientSecret });
            }
            /*
                Create payload as Object with integrationName: {...}
             */
            updateMutation({ [row.integrationName]: {...obj} })
                .then(res => {
                    if(!res.success){
                        return notification(res.message, 'error')
                    } else {
                        notification('Updated Successfully');
                    }
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
            setErrors({...errors, password: 'Please enter Password'});
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
        <Alert
            config={{open: true, message: 'Data changes will reflect after an hour of saving.', severity: 'info'}}
            inStyles={{mb:2}}
        />
        <form noValidate onSubmit={onSubmit}>
            <Grid container spacing={3} direction='column' sx={{minWidth: 350}}>
                {isChrobinson && <Grid item>
                    <Input
                        fullWidth
                        label='Client ID'
                        name='clientId'
                        onChange={onChange}
                        value={form.clientId || ''}
                    />
                </Grid>}
                {isChrobinson && <Grid item>
                    <Input
                        fullWidth
                        label='Client Secret'
                        name='clientSecret'
                        onChange={onChange}
                        value={form.clientSecret || ''}
                        multiline
                        rows={3}
                    />
                </Grid>}
                {!isChrobinson && <Grid item>
                    <Input
                        fullWidth
                        label='Code'
                        name='code'
                        onChange={onChange}
                        value={form.code || ''}
                        multiline
                        rows={5}
                    />
                </Grid>}
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