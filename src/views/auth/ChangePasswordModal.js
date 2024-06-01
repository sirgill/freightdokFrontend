import Modal from "../../components/Atoms/Modal";
import {useSelector} from "react-redux";
import {Grid} from "@mui/material";
import {Alert, LoadingButton, Password} from "../../components/Atoms";
import useMutation from "../../hooks/useMutation";
import {useState} from "react";
import {changePasswordModal} from "../../actions/component.action";
import {notification} from "../../actions/alert";
import {validatePasswords} from "./utils";

const config = {
    title: 'Change Password',
    preventBackdropClick: true
}

const formDefaults = {pass: '', confirmPass: '', currentPass: ''}

const ChangePasswordModal = () => {
    const {open} = useSelector(state => state.app.changePasswordModal);

    const [form, setForm] = useState(formDefaults),
        [errors, setErrors] = useState({}),
        [alert, setAlert] = useState({open: false, message: '', severity: 'error'}),
        {mutation, loading} = useMutation('/api/users/changePassword');

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
        setErrors({...errors, [name]: ''});
    }

    function afterSubmit({success, data}) {
        if (success) {
            onClose();
            notification(data.message);
        } else {
            setAlert({...alert, open: true, message: data.message});
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        closeAlert();
        const {confirmPass, pass, currentPass} = form;
        const {isValid, err} = validatePasswords(currentPass, pass, confirmPass)
        if(!isValid){
            return setErrors(err);
        }
        if (pass !== confirmPass) {
            return setAlert({...alert, open: true, message: 'Passwords do not match'});
        }
        mutation(form, 'put', afterSubmit)
    }

    const closeAlert = () => {
        setAlert({...alert, open: false});
    }

    const onClose = () => {
        setErrors({});
        setForm(formDefaults);
        setAlert({open: false, message: '', severity: 'error'});
        changePasswordModal(false);
    }

    if (!open) {
        return null;
    }

    return <Modal config={config} closeCallback={onClose}>
        <Grid container direction='column' gap={2} component={'form'} onSubmit={onSubmit} minWidth={300}>
            <Alert config={alert}/>
            <Grid item xs={12}>
                <Password label='Current Password' onChange={onChange} value={form.currentPass} name='currentPass' errors={errors}/>
            </Grid>
            <Grid item xs={12}>
                <Password label='New Password' onChange={onChange} value={form.pass} name='pass' errors={errors}/>
            </Grid>
            <Grid item xs={12}>
                <Password label='Confirm Password' onChange={onChange} value={form.confirmPass} name='confirmPass'
                          errors={errors}/>
            </Grid>
            <Grid item xs={12} sx={{m: 'auto'}}>
                <LoadingButton isLoading={loading} type='submit' loadingText='Please wait...'>Submit</LoadingButton>
            </Grid>
        </Grid>
    </Modal>
}

export default ChangePasswordModal;