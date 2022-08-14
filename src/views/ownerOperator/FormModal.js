import DialogTitle from "@mui/material/DialogTitle";
import _ from 'lodash';
import {blue} from "../../components/layout/ui/Theme";
import DialogContent from "@mui/material/DialogContent";
import InputField from "../../components/Atoms/form/InputField";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {getBaseUrl} from "../../config";
import {notification} from "../../actions/alert";
import {checkObjProperties, triggerCustomEvent} from "../../utils/utils";
import {Button} from "@mui/material";

const validateForm = ({firstName, lastName, phoneNumber}) => {
    let errors = {}
    if (!firstName) {
        errors.firstName = 'Please provide the First Name'
    }
    if (!lastName) {
        errors.lastName = 'Please provide the Last Name'
        // return [false, 'Please provide the Last Name', 'lastName']
    }
    if (!phoneNumber) {
        errors.phoneNumber = 'Please provide the Phone Number'
    }
    return errors
}
const formTemplate = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
}


const FormModal = (props) => {
    const {history, match: {params: {id = ''} = {}} = {}} = props;
    const [users, setUsers] = useState([])
    const [form, setForm] = React.useState(formTemplate);
    const [errors, setErrors] = useState(formTemplate);
    const updateForm = (e) => {
        const {target: {name, value} = {}} = e
        setForm({...form, [name]: value});
    }
    const ownerops = (users || []).filter(user => user.role.toLowerCase() === 'owneroperator')

    useEffect(() => {
        if (id) {
            axios.get(getBaseUrl() + "/api/ownerOperator/" + id)
                .then(res => {
                    const {data: {data = {}} = {}} = res;
                    if (data) {
                        setForm(data);
                    }
                })
                .catch(err => {
                    notification(err.message)
                })
        }
        if(_.isEmpty(ownerops)){
            axios.get(`/api/users?page=${0}&limit=${0}`)
                .then(r => {
                    setUsers(r.data.users)
                })
                .catch(e => {
                    console.log(e.message);
                    notification(e.message, 'error')
                })
        }
    }, [])

    const onBlur = (e) => {
        const {target: {name, value}} = e;
        if (value) {
            setErrors({...errors, [name]: ''});
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {...form};
        const errors = validateForm(data);
        if (_.isEmpty(errors)) {
            axios.post(getBaseUrl() + "/api/ownerOperator", data)
                .then(res => {
                    const {data: {success, message} = {} = {}} = res || {};
                    if (success) {
                        notification(message);
                        handleClose();
                        setTimeout(() => {
                            triggerCustomEvent('refreshOwnerOp')
                        }, 500)
                    }
                })
                .catch(err => err.message)
        }
        else {
            setErrors({...errors})
        }
    };

    const handleClose = () => {
        history.push('/dashboard');
    }
    return (
        <Dialog
            fullWidth={false}
            maxWidth={"md"}
            open={true}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            PaperProps={{
                sx: {
                    width: 400
                }
            }}
        >
            <DialogTitle id="form-dialog-title" sx={{
                color: blue,
                textAlign: 'center',
                fontWeight: 400,
                letterSpacing: 1
            }}>
                {id ? "Edit" : 'Add'} Owner Operator
            </DialogTitle>
            <DialogContent>
                <div className="">
                    <form className={''}>

                        <div>
                            <InputField
                                name={"firstName"}
                                label={"First Name"}
                                onChange={updateForm}
                                value={form.firstName || ''}
                                errorText={errors['firstName']}
                                onBlur={onBlur}
                            />
                            <InputField
                                name={"lastName"}
                                label={"Last Name"}
                                onChange={updateForm}
                                value={form.lastName || ''}
                                errorText={errors['lastName']}
                                onBlur={onBlur}
                            />
                            <InputField
                                name={"phoneNumber"}
                                label={"Phone Number"}
                                onChange={updateForm}
                                value={form.phoneNumber || ''}
                                onBlur={onBlur}
                                errorText={errors['phoneNumber']}
                            />
                            {!id && <InputField
                                value={form.user}
                                name="user"
                                onChange={updateForm}
                                label='Select Onwer Operator'
                                type={'select'}
                                showFirstBlank={true}
                                options={ownerops.map(driver => ({id: driver._id, label: driver.email}))}
                            />}
                        </div>

                        <Grid container spacing={1} style={{marginTop: "20px"}}>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <Button
                                    className=""
                                    type="submit"
                                    variant={'contained'}
                                    onClick={onSubmit}
                                    style={{width: '100%'}}
                                    disabled={!checkObjProperties(form)}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={3}></Grid>
                        </Grid>

                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FormModal