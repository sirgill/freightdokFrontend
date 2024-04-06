import React, {useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {
    resetUserSelected,
    fetchUsers,
    openModal,
} from "../../actions/users";
import {PRIMARY_BLUE} from "../layout/ui/Theme";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";
import {isEmailValid} from "../../utils/utils";
import {ROLES} from "../constants";
import {Alert, Input, LoadingButton, Password, Select} from "../Atoms";
import {UserSettings} from "../Atoms/client";

const initialState = {
    email: "",
    password: "",
    role: "dispatch",
    firstName: '',
    lastName: ''
};

// const ADD_USERS_ROLES_PERMITTED = [ROLES.superadmin, ROLES.admin, ROLES.dispatch];

const UserForm = () => {
    const {mutation, loading: isSaving} = useMutation('/api/users')
    const [form, setForm] = useState({...initialState}),
        [alertConfig, setAlertConfig] = useState({open: false, severity: 'error', message: ''});
    const {loading, open, error, user, page, limit} = useSelector(
        (state) => state.users
    );
    const {mutation: updateUser, loading: isSavingUpdate} = useMutation(`/api/users/${user?._id}`)
    const {user: auth = {}, allRoles = []} = useSelector((state) => state.auth);
    const {roles = []} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [userRoles, setUserRoles] = useState();
    const {add = false} = UserSettings.getUserPermissionsByDashboardId('users');

    useEffect(() => {
        if (auth?.role.equalsIgnoreCase(ROLES.superadmin)) {
            setUserRoles(roles)
        } else {
            const newRoles = roles.filter(
                (item) =>
                    item === "driver" ||
                    item === "afterhours" ||
                    item === "load planner" ||
                    item === "support" ||
                    item === 'dispatch' ||
                    item === 'ownerOperator'
            );
            setUserRoles(newRoles);
        }
        setForm((prev) => ({...prev, role: (allRoles.length) ? allRoles[0]?._id : ''}))
    }, [roles, allRoles.length]);

    useEffect(() => {
        if (!open) handleClose();
    }, [open]);

    useEffect(() => {
        if (+page === 0 && open) {
            handleClose();
            dispatch(fetchUsers(+page, +limit));
        }
    }, [page]);

    useEffect(() => {
        if (user) {
            const {email, rolePermissionId, firstName, lastName} = user;
            setForm((f) => ({...f, email, firstName, lastName, role: rolePermissionId}));
            dispatch(openModal());
        }
    }, [user]);

    const handleChange = ({name, value}) => {
        setForm((f) => ({...f, [name]: value}));
    };
    const handleClose = () => {
        setForm({...initialState});
        dispatch(resetUserSelected());
    };

    const handleClickOpen = () => {
        dispatch(openModal());
    };

    const getDiff = (local, actual) => {
        const diffWithVal = {};
        const localKeys = Object.keys(local);
        for (let key of localKeys) {
            if (key !== "password" && actual[key] !== local[key])
                diffWithVal[key] = local[key];
            if (key === "password" && local[key]) diffWithVal[key] = local[key];
        }
        return diffWithVal;
    };

    function afterSubmit({success, data}) {
        if (success) {
            handleClose();
            dispatch(fetchUsers(+page, +limit));
            notification((user._id ? 'Updated ' : 'Saved ') + 'Successfully');
        } else {
            setAlertConfig({open: true, message: data.message, severity: 'error'});
        }
    }

    const closeAlert = () => setAlertConfig({...alertConfig, open: false})

    const onSubmit = async (e) => {
        e.preventDefault();
        closeAlert();
        const {email, password, role, firstName} = form;
        const {_id, roleName} = allRoles.find(_role => _role._id === role) || {};
        if (!loading) {
            if (!user) {
                if (!email || !password || !role || !firstName)
                    return alert("All required fields should be provided");
                else if (!isEmailValid(email)) {
                    return alert('Email is not valid');
                } else if (password.length < 6) {
                    return alert('Please enter password with 6 or more characters');
                }

                await mutation({...form, rolePermissionId: _id, role: roleName}, '', afterSubmit);
            } else {
                const dataToUpdate = getDiff(form, user);
                await updateUser({...dataToUpdate, rolePermissionId: role, role: roleName}, 'put', afterSubmit);
            }
        }
    };

    return (
        <>
            <Button
                color="primary"
                variant={'contained'}
                onClick={handleClickOpen}
                disabled={!add}
            >
                Add User
            </Button>
            <Dialog
                fullWidth={false}
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
                <DialogTitle id="form-dialog-title" sx={{textAlign: 'center', color: PRIMARY_BLUE}}>
                    {user ? "Update" : "Add"} User
                </DialogTitle>
                {error ? <p style={{textAlign: "center"}}>{error}</p> : ""}
                <DialogContent sx={{p: 0, overflow: 'hidden'}}>
                    <div className="">
                        <form noValidate onSubmit={onSubmit}>
                            <Grid container spacing={2} direction={'column'} sx={{p: 3}}>
                                <Alert config={alertConfig} onClose={closeAlert} inStyles={{pl: 2}} />
                                <Grid item>
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
                                <Grid item>
                                    <Input
                                        name={'lastName'}
                                        value={form.lastName || ''}
                                        onChange={handleChange}
                                        label='Last Name'
                                    />
                                </Grid>
                                <Grid item>
                                    <Input
                                        name={"email"}
                                        label={"Email"}
                                        onChange={handleChange}
                                        value={form.email}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item>
                                    <Password
                                        name={"password"}
                                        label={"Password"}
                                        onChange={handleChange}
                                        value={form.password}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item>
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
                                        isLoading={isSaving || isSavingUpdate}
                                        className=""
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserForm;
