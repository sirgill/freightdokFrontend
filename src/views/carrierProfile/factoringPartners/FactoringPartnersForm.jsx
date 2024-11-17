import Modal from "../../../components/Atoms/Modal";
import React, {useState} from "react";
import {Box, Grid} from "@mui/material";
import {FullScreenLoader, Input, LoadingButton} from "../../../components/Atoms";
import styled from "@mui/material/styles/styled";
import useMutation from "../../../hooks/useMutation";
import {GET_FACTORING_PARTNERS} from "../../../config/requestEndpoints";
import {notification} from "../../../actions/alert";
import {useHistory} from "react-router";
import useFetch from "../../../hooks/useFetch";

const GridForm = styled(Grid)(({theme}) => ({
    width: 400,
    gap: 20,
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
}))

function validateFields(form) {
    const obj = {};
    let isValid = true
    if (!form.name) {
        obj.name = 'Partner Name is required';
        isValid = false
    }
    if (!form.noticeText) {
        obj.noticeText = 'Notice text is required';
        isValid = false
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
            noticeText: form.noticeText
        }
        const {isValid, errors} = validateFields(body)
        if (isValid) {
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
        <Input name='name' value={form.name} onChange={onChange} label='Partner Name' errors={errors}/>
        <Input name='host' value={form.host} onChange={onChange} label='Host' errors={errors}/>
        <Input name='port' value={form.port} onChange={onChange} label='Port' errors={errors}/>
        <Input multiline
               rows={4}
               name='noticeText' value={form.noticeText} onChange={onChange} label='Notice Text' errors={errors}/>
        <LoadingButton fullWidth isLoading={loading} type='submit'
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