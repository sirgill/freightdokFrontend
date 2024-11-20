import Modal from "../../../components/Atoms/Modal";
import _ from 'lodash';
import React, {useState} from "react";
import {Box, Grid} from "@mui/material";
import {useHistory} from "react-router";
import {FullScreenLoader, Input, LoadingButton, Password} from "../../../components/Atoms";
import styled from "@mui/material/styles/styled";
import useMutation from "../../../hooks/useMutation";
import {GET_FACTORING_PARTNERS} from "../../../config/requestEndpoints";
import {notification} from "../../../actions/alert";
import useFetch from "../../../hooks/useFetch";
import {isEmailValid} from "../../../utils/utils";

const GridForm = styled(Grid)(({theme}) => ({
    width: 400,
    gap: 20,
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
}))

function validateFields(form) {
    const obj = {}, {password, confirmPassword} = form;
    let isValid = true
    if (!form.name) {
        obj.name = 'Partner Name is required';
        isValid = false
    }
    if (!form.noticeText) {
        obj.noticeText = 'Notice text is required';
        isValid = false
    }
    if (!form.email) {
        obj.noticeText = 'Notice text is required';
        isValid = false
    } else if(!isEmailValid(form.email)){
        isValid = false;
        obj.email = 'Please enter a valid email';
    }
    if(password && !confirmPassword) {
        obj.confirmPassword = 'Please enter Confirm Password'
        isValid = false;
    }
    else if((!password && confirmPassword) || (password !== confirmPassword)) {
        obj.confirmPassword = 'Passwords does not match'
        isValid = false;
    }
    return {isValid, errors: obj};
}

const Form = ({onCloseUrl, id, refetch, data}) => {
    const [form, setForm] = useState(data)
    const {mutation, loading} = useMutation(GET_FACTORING_PARTNERS + `/${id}`);
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
        setErrors({...errors, [name]: ''})
    }

    function onSubmit(e) {
        e.preventDefault()
        const body = {
            name: form.name,
            host: form.host,
            port: form.port,
            noticeText: form.noticeText,
            email: form.email
        }
        if(form.password) {
            body.password = form.password;
        }
        if(form.confirmPassword) {
            body.confirmPassword = form.confirmPassword;
        }
        const {isValid, errors} = validateFields(body)
        if (isValid) {
            setErrors({});
            delete body.confirmPassword;
            mutation(body, 'put', ({success, data}) => {
                if (success) {
                    refetch()
                    notification(data.message);
                    history.replace(onCloseUrl);
                } else {
                    notification(data.message, 'error')
                }
            })
        } else {
            setErrors(errors)
        }
    }

    return <GridForm component='form' container onSubmit={onSubmit}>
        <Input name='name' value={form?.name} onChange={onChange} label='Partner Name' errors={errors}/>
        <Input name='host' value={form?.host} onChange={onChange} label='Host' errors={errors}/>
        <Input name='port' value={form?.port} onChange={onChange} label='Port' errors={errors}/>
        <Input name='email' value={form?.email} onChange={onChange} label='Email' type='email' errors={errors} />
        <Password name='password' value={form?.password} onChange={onChange} label='Password' errors={errors} />
        <Password name='confirmPassword' value={form?.confirmPassword} onChange={onChange} label='Confirm Password' errors={errors} />
        <Input multiline
               rows={4}
               name='noticeText' value={form?.noticeText} onChange={onChange} label='Notice Text' errors={errors}/>
        <LoadingButton
            fullWidth
            isLoading={loading}
            type='submit'
            disabled={_.isEqual(form, data)}
        >
            Update
        </LoadingButton>
    </GridForm>
}

const FactoringPartnersForm = (props) => {
    const {onCloseUrl, refetch, match: {params: {id} = {}} = {}} = props
    const {data, loading} = useFetch(GET_FACTORING_PARTNERS + `/${id}`)

    if(loading) {
        return <FullScreenLoader />
    }
    return <Modal
        config={{
            title: 'Update Factoring Partner'
        }}
    >
        <Box>
            <Form {...{onCloseUrl, refetch, id, data}}/>
        </Box>
    </Modal>
}

export default FactoringPartnersForm;