import DialogTitle from "@mui/material/DialogTitle";
import _ from 'lodash';
import {blue} from "../../components/layout/ui/Theme";
import DialogContent from "@mui/material/DialogContent";
import InputField from "../../components/Atoms/form/InputField";
import Grid from "@mui/material/Grid";
import SubmitButton from "../../components/Atoms/form/SubmitButton";
import Dialog from "@mui/material/Dialog";
import React, {useEffect} from "react";
import axios from "axios";
import {getBaseUrl} from "../../config";
import {notification} from "../../actions/alert";
import {triggerCustomEvent} from "../../utils/utils";

const FormModal = (props) => {
    const { history, match: {params: {id = ''} = {}} = {} } = props;
    const [form, setForm] = React.useState({});
    const updateForm = (e) => {
        const {target: {name, value} = {}} = e
        setForm({...form, [name]: value});
    }

    useEffect(() => {
        if(id){
            axios.get(getBaseUrl() + "/api/ownerOperator/"+id)
                .then(res => {
                    const {data : {data = {}} = {}} = res;
                    if(data) {
                        setForm(data);
                    }
                })
                .catch(err => {
                    notification(err.message)
                })
        }
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {...form};
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
                                value={form.firstName}
                            />
                            <InputField
                                name={"lastName"}
                                label={"Last Name"}
                                onChange={updateForm}
                                value={form.lastName}
                            />
                            <InputField
                                name={"phoneNumber"}
                                label={"Phone Number"}
                                onChange={updateForm}
                                value={form.phoneNumber}
                            />
                        </div>

                        <Grid container spacing={1} style={{marginTop: "20px"}}>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <SubmitButton
                                    className=""
                                    type="submit"
                                    color="primary"
                                    onClick={onSubmit}
                                    style={{width: '100%'}}
                                    disabled={_.isEmpty(form)}
                                >
                                    Save
                                </SubmitButton>
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