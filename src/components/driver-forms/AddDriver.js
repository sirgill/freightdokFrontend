import React, {useEffect, useState} from "react";
// Redux
import PropTypes from "prop-types";
import {connect, useDispatch} from "react-redux";
import {addDriver} from "../../actions/driver.js";
import {getLoads} from "../../actions/load";
//Material
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import InputField from "../Atoms/form/InputField";
import Button from "@mui/material/Button";
import {blue} from "../layout/ui/Theme";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Box} from "@mui/material";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {getDrivers} from "../../actions/driver";

const AddDriverForm = (props) => {
    const {
            user,
            addDriver,
            all_drivers,
            getLoads,
            isEdit = false,
            data = {},
            closeEditForm,
            load: {loads, allLoads, loading},
        } = props;
    const {loading: isSaving, mutation} = useMutation("/api/drivers")
    const formTemplate = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        loads: [],
        user: "",
    },
        dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(1);
    const [form, setForm] = useState(formTemplate);

    useEffect(() => {
        if (count == 2) {
            getLoads();
        }
    }, [count]);

    const handleClickOpen = () => {
        // setForm(formTemplate);
        setCount(1);
        setOpen(true);
    };

    useEffect(() => {
        if (isEdit) {
            handleClickOpen()
            setForm(data)
        }
    }, [isEdit])

    useEffect(() => {
        return () => {
            setForm(formTemplate);
        }
    }, [])

    const handleClose = () => {
        setOpen(false);
        // setForm(formTemplate);
        setCount(1);
        if(closeEditForm) closeEditForm()
    };

    const onSubmit = (e) => {
        e.preventDefault();

        mutation(form, null, ({success, data}) => {
            if(success) {
                dispatch(getDrivers());
                handleClose();
            }
            else {
                notification(data.message, 'error')
            }
        })
    };

    const updateForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {(user && user.role === "afterhours") || (!isEdit &&
                <Button
                    color="primary"
                    onClick={handleClickOpen}
                    style={{marginBottom: "20%"}}
                    variant={'contained'}
                >
                    Add Driver
                </Button>
            )}

            <Dialog
                maxWidth={"md"}
                open={open}
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

                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: "absolute",
                                left: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                    {isEdit ? 'Edit' : 'Add'} Driver
                </DialogTitle>
                <DialogContent>
                    <div className="">
                        <Box component={'form'} sx={{px: 4, pb: 3}} onSubmit={onSubmit}>
                            {count === 1 ? (
                                <div>

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
                                {!isEdit && <InputField
                                    value={form.user}
                                    name="user"
                                    onChange={updateForm}
                                    label='Select Driver'
                                    type={'select'}
                                    showFirstBlank={true}
                                    options={all_drivers.map(driver => ({id: driver._id, label: driver.email}))}
                                />}
                            </div>

                                    <Grid container spacing={1} style={{marginTop: "20px"}} justifyContent={'center'}>
                                        <Grid item xs={12}>
                                            <LoadingButton
                                                loading={isSaving}
                                                className=""
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{width: '100%'}}
                                            >
                                                {(isEdit ? 'Update ' : 'Add ') + 'Driver'}
                                            </LoadingButton>
                                        </Grid>
                                    </Grid>
                                </div>
                            ) : null}
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

AddDriverForm.propTypes = {
    addDriver: PropTypes.func.isRequired,
    getLoads: PropTypes.func.isRequired,
    load: PropTypes.object.isRequired,
};

const mapStateToProps = ({
                             load,
                             auth: {user},
                             driver: {all_drivers},
                         }) => ({load, user, all_drivers});

export default connect(mapStateToProps, {addDriver, getLoads})(AddDriverForm);
