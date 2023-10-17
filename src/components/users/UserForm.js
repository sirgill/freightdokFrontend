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
import {capitalizeFirstLetter} from "../../utils/helper";
import InputField from "../Atoms/form/InputField";
import {blue} from "../layout/ui/Theme";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {isEmailValid} from "../../utils/utils";
import {ROLES} from "../constants";

const initialState = {
    email: "",
    password: "",
    role: "dispatch",
};

const UserForm = () => {
    const {mutation, loading: isSaving} = useMutation('/api/users')
    const [form, setForm] = useState({...initialState});
    const {loading, open, error, user, page, limit} = useSelector(
        (state) => state.users
    );
    const {mutation: updateUser, loading: isSavingUpdate} = useMutation(`/api/users/${user?._id}`)
    const {user: auth  = {}} = useSelector((state) => state.auth);
    const {roles=[]} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [userRoles, setUserRoles] = useState();

    useEffect(() => {

        if (auth?.role === "dispatch") {
            const newRoles = roles.filter(
                (item) =>
                    item === "driver" ||
                    item === "afterhours" ||
                    item === "load planner" ||
                    item === "support"
            );
            setUserRoles(newRoles);
        } else setUserRoles(roles);
    }, []);

    useEffect(() => {
        if (!open) handleClose();
    }, [open]);

    useEffect(() => {
        if (+page === 0) {
            handleClose();
            dispatch(fetchUsers(+page, +limit));
        }
    }, [page]);

    useEffect(() => {
        if (user) {
            const {email, role} = user;
            setForm((f) => ({...f, email, role}));
            dispatch(openModal());
        }
    }, [user]);

    const handleChange = ({target}) => {
        const {name, value} = target;
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
        if(success){
            handleClose();
            dispatch(fetchUsers(+page, +limit));
            notification((user._id ? 'Updated ' : 'Saved ') + 'Successfully');
        } else {
            notification(data.message, 'error')
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            if (!user) {
                const {email, password, role} = form;
                if (!email || !password || !role)
                    return alert("All fields are required");
                else if(!isEmailValid(email)){
                   return alert('Email is not valid');
                } else if (password.length < 6){
                    return alert('Please enter password with 6 or more characters');
                }
                await mutation(form, '', afterSubmit);
            } else {
                const dataToUpdate = getDiff(form, user);
                await updateUser(dataToUpdate, 'put', afterSubmit);
            }
        }
    };

    return (
        <>
            <Button
                color="primary"
                variant={'contained'}
                onClick={handleClickOpen}
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
                <DialogTitle id="form-dialog-title" sx={{textAlign: 'center', color: blue}}>
                    {user ? "Update" : "Add"} User
                </DialogTitle>
                {error ? <p style={{textAlign: "center"}}>{error}</p> : ""}
                <DialogContent sx={{p: 0, overflow: 'hidden'}}>
                    <div className="">
                        <form noValidate onSubmit={onSubmit}>
                            <Grid container spacing={1} direction={'column'} sx={{p: 3}}>
                                <Grid item>
                                    <InputField
                                        name={"email"}
                                        label={"Email"}
                                        autoComplete={"off"}
                                        onChange={handleChange}
                                        value={form.email}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item>
                                    <InputField
                                        name={"password"}
                                        label={"Password"}
                                        autoComplete={"off"}
                                        onChange={handleChange}
                                        value={form.password}
                                    />
                                </Grid>
                                <Grid item>
                                    <InputField
                                        value={form.role}
                                        name="role"
                                        onChange={handleChange}
                                        label={"Role"}
                                        autoComplete={"off"}
                                        type='select'
                                        options={userRoles &&
                                        userRoles.map((role) => ({id: role, label: capitalizeFirstLetter(role)}))}
                                    />
                                </Grid>
                                <Grid item xs={12} justifyContent='center' display={'flex'}>
                                    <LoadingButton
                                        loading={isSaving || isSavingUpdate}
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
