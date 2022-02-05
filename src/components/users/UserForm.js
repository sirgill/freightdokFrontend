import React, {useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {
    registerUser,
    resetUserSelected,
    updateUser,
    fetchUsers,
    openModal,
} from "../../actions/users";
import {capitalizeFirstLetter} from "../../utils/helper";
import {useStyles} from "../HelperCells";
import InputField from "../Atoms/form/InputField";
import {blue} from "../layout/ui/Theme";

const initialState = {
    email: "",
    password: "",
    role: "",
};

const UserForm = () => {
    const classes = useStyles();
    const [form, setForm] = useState({...initialState});
    const {loading, open, error, user, page, limit} = useSelector(
        (state) => state.users
    );
    const {user: auth} = useSelector((state) => state.auth);
    const {roles} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [userRoles, setUserRoles] = useState();

    useEffect(() => {
        setUserRoles(roles);

        if (auth.role === "dispatch") {
            const newRoles = roles.filter(
                (item) =>
                    item === "driver" ||
                    item === "afterhours" ||
                    item === "load planner" ||
                    item === "support"
            );
            setUserRoles(newRoles);
        }
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

    const onSubmit = () => {
        if (!loading) {
            if (!user) {
                const {email, password, role} = form;
                if (!email || !password || !role)
                    return alert("All fields are required");
                dispatch(registerUser(form));
            } else {
                const {_id} = user;
                const dataToUpdate = getDiff(form, user);
                dispatch(updateUser(dataToUpdate, _id));
            }
        }
    };

    return (
        <>
            {(auth && ["user"].indexOf(auth.role) > -1) || (
                <Button
                    color="primary"
                    variant={'contained'}
                    onClick={handleClickOpen}
                    style={{marginBottom: "20%"}}
                >
                    Add User
                </Button>
            )}
            <Dialog
                fullWidth={true}
                maxWidth={"xs"}
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title" sx={{textAlign: 'center', color: blue}}>
                    {user ? "Update" : "Add"} User
                </DialogTitle>
                {error ? <p style={{textAlign: "center"}}>{error}</p> : ""}
                <DialogContent>
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
                                        labelStyle={{fontWeight: 600}}
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
                                        labelStyle={{fontWeight: 600}}
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
                                        labelStyle={{fontWeight: 600}}
                                    />
                                </Grid>
                                <Grid item xs={12} justifyContent='center' display={'flex'}>
                                    <Button
                                        className=""
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit
                                    </Button>
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
