import Modal from "../Atoms/Modal";
import {Grid} from "@mui/material";
import {Alert, Input, LoadingButton, Password, Select} from "../Atoms";
import React, {useEffect, useState} from "react";
import {getDiff, isEmailValid, triggerCustomEvent} from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";
import {useSelector} from "react-redux";
import useLazyFetch from "../../hooks/useLazyFetch";
import {styled} from "@mui/material/styles";

const initialState = {
    email: "",
    password: "",
    role: "",
    firstName: '',
    lastName: ''
};

const GridContainer = styled(Grid)(({ theme }) => ({
    width: 350,
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
}))

function Body({id, onRefetch}) {
    const {mutation, loading: isSaving} = useMutation('/api/users')
    const {mutation: updateUser, loading: isSavingUpdate} = useMutation(`/api/users/${id}`),
        {loading, data} = useLazyFetch('/api/users/' + id, {
            lazyFetchCondition: !!id
        })
    const [form, setForm] = useState({...initialState}),
        [alertConfig, setAlertConfig] = useState({open: false, severity: 'error', message: ''});
    const {allRoles = []} = useSelector((state) => state.auth);
    const handleChange = ({name, value}) => {
        setForm((f) => ({...f, [name]: value}));
    };

    useEffect(() => {
        if (data) {
            const {email, firstName, lastName, rolePermissionId: role} = data.data || {};
            setForm(prev => ({...prev, email, firstName, lastName, role}));
        }
    }, [data]);

    const closeAlert = () => setAlertConfig({...alertConfig, open: false});

    function afterSubmit({success, data}) {
        if (success) {
            onRefetch();
            notification((id ? 'Updated ' : 'Saved ') + 'Successfully');
            triggerCustomEvent('closeModal');
        } else {
            setAlertConfig({open: true, message: data.message, severity: 'error'});
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        closeAlert();
        const {email, password, role, firstName} = form;
        const {_id, roleName} = allRoles.find(_role => _role._id === role) || {};
        if (!id) {
            if (!email || !password || !role || !firstName)
                return alert("All required fields should be provided");
            else if (!isEmailValid(email)) {
                return alert('Email is not valid');
            } else if (password.length < 6) {
                return alert('Please enter password with 6 or more characters');
            }

            await mutation({...form, rolePermissionId: _id, role: roleName}, '', afterSubmit);
        } else {
            const dataToUpdate = getDiff(form, data.data);
            await updateUser({...dataToUpdate, rolePermissionId: role, role: roleName}, 'put', afterSubmit);
        }
    }


    return <GridContainer container component='form' noValidate onSubmit={onSubmit} spacing={2}>
        <Alert config={alertConfig} onClose={closeAlert} inStyles={{pl: 2, width: '100%'}}/>
        <Grid item xs={12}>
            <Input
                name={'firstName'}
                value={form.firstName || ''}
                onChange={handleChange}
                autoFocus
                trimValue
                label='First Name'
                required
            />
        </Grid>
        <Grid item xs={12}>
            <Input
                name={'lastName'}
                value={form.lastName || ''}
                onChange={handleChange}
                label='Last Name'
            />
        </Grid>
        <Grid item xs={12}>
            <Input
                name={"email"}
                label={"Email"}
                onChange={handleChange}
                value={form.email}
                fullWidth
                required
            />
        </Grid>
        <Grid item xs={12}>
            <Password
                name={"password"}
                label={"Password"}
                onChange={handleChange}
                value={form.password}
                fullWidth
                required
            />
        </Grid>
        <Grid item xs={12}>
            <Select
                onChange={handleChange}
                label={"Role"}
                name="role"
                value={form.role}
                options={allRoles}
                labelKey='roleName'
                valueKey='_id'
                required
            />
        </Grid>
        <Grid item xs={12} justifyContent='center' display={'flex'}>
            <LoadingButton
                isLoading={loading || isSaving || isSavingUpdate}
                className=""
                type="submit"
                variant="contained"
                color="primary"
                loadingText={loading ? 'Please Wait...' : (isSaving || isSavingUpdate) ? "Updating..." : null}
            >
                {id ? "Update" : 'Submit'}
            </LoadingButton>
        </Grid>
    </GridContainer>;
}

const Form = (props) => {
    const {closeUrl, onRefetch, match: {params: {id} = {}} = {}} = props,
        _id = id === 'add' ? null : id;

    const config = {
        title: _id ? 'Edit User' : 'Add User',
        closeUrl,
        preventBackdropClick: true
    }
    return <Modal config={config}>
        <Body id={_id} onRefetch={onRefetch} />
    </Modal>
}

export default Form;