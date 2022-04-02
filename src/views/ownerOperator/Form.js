import DialogTitle from "@mui/material/DialogTitle";
import { blue } from "../../components/layout/ui/Theme";
import DialogContent from "@mui/material/DialogContent";
import InputField from "../../components/Atoms/form/InputField";
import Grid from "@mui/material/Grid";
import SubmitButton from "../../components/Atoms/form/SubmitButton";
import Dialog from "@mui/material/Dialog";
import React, { Fragment } from "react";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";

const Form = ({ isEdit = false }) => {
    const [open, setOpen] = React.useState(false),
        [form, setForm] = React.useState({});
    const user = useSelector(state => state.auth)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    }

    const updateForm = (e) => {
        const { target: { name, value } = {} } = e
        setForm({ ...form, [name]: value });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        // addDriver(form, isEdit);
        handleClose();
    };

    return (
        <Fragment>
            {(user && user.role === "afterhours") || (!isEdit &&
                <Button
                    color="primary"
                    onClick={handleClickOpen}
                    style={{ marginBottom: "20%" }}
                    variant={'contained'}
                >
                    Add Owner-Op
                </Button>
            )}
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title" sx={{
                    color: blue,
                    textAlign: 'center',
                    fontWeight: 400,
                    letterSpacing: 1
                }}>{isEdit ? 'Edit' : 'Add'} Owner Operator</DialogTitle>
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

                            <Grid container spacing={1} style={{ marginTop: "20px" }}>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={6}>
                                    <SubmitButton
                                        className=""
                                        type="submit"
                                        color="primary"
                                        onClick={onSubmit}
                                        style={{ width: '100%' }}
                                    >
                                        Submit
                                    </SubmitButton>
                                </Grid>
                                <pre>Note: Owner Op does not gets save at this time</pre>
                                <Grid item xs={3}></Grid>
                            </Grid>

                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

export default Form;