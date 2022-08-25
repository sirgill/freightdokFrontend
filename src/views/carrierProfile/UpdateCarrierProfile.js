import Modal from "../ownerOperator/Modal";
import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import React, {useEffect, useState} from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {useHistory} from 'react-router-dom';
import {requestGet, requestPost} from "../../utils/request";
import {notification} from "../../actions/alert";
import {getUserDetail} from "../../utils/utils";
import {getCarrierProfile} from "../../actions/carrierProfile.action";
import {useDispatch} from "react-redux";


const Form = ({onCloseUrl}) => {
    const [formData, setFormData] = useState({});
    const history = useHistory();
    const [processing, setProcessing] = useState(false)
    const {id} = getUserDetail().user || {}
    const dispatch = useDispatch();

    useEffect(() => {
        const getCarrierProfile = async () => {
            const {success, data} = await requestGet({uri: '/api/fmcsa/'+ id})
            if(success){
                const {data: {autoLiabilityInsurance, generalLiabilityInsurance, cargoLiabilityInsurance, email, phone} = {}} = data
                setFormData({
                    autoLiabilityInsurance: autoLiabilityInsurance ? autoLiabilityInsurance.url : '',
                    generalLiabilityInsurance: generalLiabilityInsurance ? generalLiabilityInsurance.url : '',
                    cargoLiabilityInsurance: cargoLiabilityInsurance ? cargoLiabilityInsurance.url : '',
                    email,
                    phone
                })
            }
        }
        getCarrierProfile();
    }, [])

    const handleFileChange = ({ target: { name, files } }) => {
        setFormData((f) => ({ ...f, [name]: files || null }));
    };

    const onChange = ({target: {name, value}}) => {
        setFormData({...formData, [name]: value})
    }

    const onSubmit = (e) => {
        setProcessing(true)
        e.preventDefault()
        const form = new FormData();
        for (let key of Object.keys(formData)) {
            if (["generalLiabilityInsurance", "autoLiabilityInsurance", "cargoLiabilityInsurance"].indexOf(key) < 0) {
                const data = formData[key];
                const isArray = Array.isArray(data);
                const isNull = data === null;
                let dataToSend = isArray && !isNull ? JSON.stringify(data) : data;
                form.append(key, dataToSend);
            }
        }
        for (let key of ["generalLiabilityInsurance", "autoLiabilityInsurance", "cargoLiabilityInsurance"]) {
            const files = formData[key];
            if (files) for (let file of files) form.append(key, file);
        }
        requestPost({uri: '/api/fmcsa', body: form })
            .then(res => {
                notification(res.data.message)
                dispatch(getCarrierProfile());
                history.push(onCloseUrl)
            })
            .catch(err => {
                console.log(err);
                notification(err.message, 'error');
            })
            .finally(() => setProcessing(false))
    }

    return <Box component='form' noValidate sx={{minWidth: 400}} onSubmit={onSubmit}>
        <Stack spacing={3}>
            <TextField
                type='email'
                label='Email'
                fullWidth
                onChange={onChange}
                value={formData.email||''}
                name='email'
            />
            <TextField
                type='email'
                label='Phone Number'
                fullWidth
                value={formData.phone||''}
                onChange={onChange}
                name={'phone'}
            />
            <Stack direction={'row'} alignItems='center' justifyContent='space-between'>
                <Typography>General Liability Insurance</Typography>
                <label htmlFor="contained-button-file1">
                    <input
                        style={{display: 'none'}}
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.ms-excel"
                        name="generalLiabilityInsurance"
                        onChange={handleFileChange}
                        id="contained-button-file1"
                    />
                    <Button variant="contained" component="span">
                        Attach
                    </Button>
                </label>
            </Stack>
            <Stack direction={'row'} alignItems='center' justifyContent='space-between'>
                <Typography>Auto Liability Insurance</Typography>
                <label htmlFor="contained-button-file2">
                    <input
                        style={{display: 'none'}}
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.ms-excel"
                        name="autoLiabilityInsurance"
                        onChange={handleFileChange}
                        id="contained-button-file2"
                    />
                    <Button variant="contained" component="span">
                        Attach
                    </Button>
                </label>
            </Stack>
            <Stack direction={'row'} alignItems='center' justifyContent='space-between'>
                <Typography>Cargo Liability Insurance</Typography>
                <label htmlFor="contained-button-file3">
                    <input
                        style={{display: 'none'}}
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.ms-excel"
                        name="cargoLiabilityInsurance"
                        onChange={handleFileChange}
                        id="contained-button-file3"
                    />
                    <Button variant="contained" component="span">
                        Attach
                    </Button>
                </label>
            </Stack>
            <LoadingButton loading={processing} loadingIndicator='Updating...' type='submit' variant='contained'>
                Update
            </LoadingButton>
        </Stack>
    </Box>
}

const UpdateCarrierProfile = ({onCloseUrl}) => {
    const config = {
        title: 'Update Carrier Profile',
        closeUrl: onCloseUrl,
        paperProps: {
            sx: {
                width: 'auto'
            }
        }
    }
    return <Modal config={config}>
        <Form onCloseUrl={onCloseUrl}/>
    </Modal>
}

export default UpdateCarrierProfile;