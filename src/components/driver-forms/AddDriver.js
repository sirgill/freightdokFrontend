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
import Button from "@mui/material/Button";
import {blue} from "../layout/ui/Theme";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Box} from "@mui/material";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";
import {getDrivers} from "../../actions/driver";
import {UserSettings} from "../Atoms/client";
import {Input, LoadingButton, Select} from "../Atoms";
import AddIcon from "@mui/icons-material/Add";

// const ADD_DRIVERS_ROLES_PERMITTED = [ROLES.superadmin, ROLES.admin, ROLES.afterhours];

const {add} = UserSettings.getUserPermissionsByDashboardId('drivers')

const validateForm = ({firstName, phoneNumber, user, lastName}) => {
    let valid = true, errors = {}
    if (!firstName) {
        valid = false;
        errors.firstName = 'First Name is required'
    }
    if (!lastName) {
        valid = false;
        errors.lastName = 'Last Name is required'
    }
    if (!phoneNumber) {
        valid = false;
        errors.phoneNumber = 'Phone Number is required'
    }
    if (!user) {
        valid = false;
        errors.user = 'Please select a Driver'
    }
    return {valid, errors};
}

const AddDriverForm = (props) => {
    const {
        all_drivers,
        getLoads,
        isEdit = false,
        data = {},
        closeEditForm,
    } = props;
    const {loading: isSaving, mutation} = useMutation("/api/drivers")
    const formTemplate = {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            user: "",
        },
        dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(1);
    const [form, setForm] = useState(formTemplate),
        [errors, setErrors] = useState({});

    useEffect(() => {
        if (count === 2) {
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
        return () => {
            setForm(() => formTemplate);
        }
    }, [isEdit])

    const handleClose = () => {
        setOpen(false);
        // setForm(formTemplate);
        setCount(1);
        if (closeEditForm) closeEditForm()
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const {valid, errors} = validateForm(form);
        if (!valid) {
            return setErrors({...errors})
        }
        mutation(form, null, ({success, data}) => {
            if (success) {
                dispatch(getDrivers());
                handleClose();
                setForm(() => formTemplate);
                notification(data.message);
            } else {
                notification(data.message, 'error')
            }
        })
    };

    const updateForm = ({name, value}) => {
        setForm({
            ...form,
            [name]: value,
        });
        setErrors((prev) => ({...prev, [name]: ''}))
    };

    return (
        <>
            {(!isEdit &&
                <Button
                    disabled={!add}
                    color="primary"
                    onClick={handleClickOpen}
                    style={{marginBottom: "20%"}}
                    variant={'contained'}
                    startIcon={<AddIcon />}
                >
                    Add
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
                        <CloseIcon/>
                    </IconButton>

                    {isEdit ? 'Edit' : 'Add'} Driver
                </DialogTitle>
                <DialogContent>
                    <div className="">
                        <Box component={'form'} sx={{px: 4, pb: 3}} onSubmit={onSubmit} noValidate>
                            <Grid container sx={{'& .MuiFormControl-fullWidth': {mb: 2}}}>
                                <Input
                                    name={"firstName"}
                                    label={"First Name"}
                                    onChange={updateForm}
                                    value={form.firstName}
                                    errors={errors}
                                    formControlSx={{mt: .8}}
                                    required
                                />
                                <Input
                                    name={"lastName"}
                                    label={"Last Name"}
                                    onChange={updateForm}
                                    value={form.lastName}
                                    errors={errors}
                                    required
                                />
                                <Input
                                    name={"phoneNumber"}
                                    label={"Phone Number"}
                                    onChange={updateForm}
                                    value={form.phoneNumber}
                                    errors={errors}
                                    required
                                />
                                {!isEdit && <Select
                                    value={form.user}
                                    name="user"
                                    onChange={updateForm}
                                    label='Select Driver'
                                    showNone={true}
                                    options={all_drivers.map(driver => ({id: driver._id, label: driver.email}))}
                                    errors={errors}
                                    required
                                />}
                            </Grid>
                            <LoadingButton
                                sx={{mt: 2}}
                                type="submit"
                                variant="contained"
                                loadingText={isEdit ? 'Updating...' : 'Saving...'}
                                fullWidth
                                isLoading={isSaving}
                            >
                                {(isEdit ? 'Update ' : 'Add ') + 'Driver'}
                            </LoadingButton>
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
