import React, { useState, useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  resetUserSelected,
  updateUser,
  fetchUsers,
  openModal,
} from "../../actions/users";
import { capitalizeFirstLetter } from "../../utils/helper";
import { TextFieldHelper, useStyles } from "../HelperCells";

const initialState = {
  email: "",
  password: "",
  role: "",
};

const UserForm = () => {
  const classes = useStyles();
  const [form, setForm] = useState({ ...initialState });
  const { loading, open, error, user, page, limit } = useSelector(
    (state) => state.users
  );
  const { user: auth } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.auth);
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
      const { email, role } = user;
      setForm((f) => ({ ...f, email, role }));
      dispatch(openModal());
    }
  }, [user]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleClose = () => {
    setForm({ ...initialState });
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
        const { email, password, role } = form;
        if (!email || !password || !role)
          return alert("All fields are required");
        dispatch(registerUser(form));
      } else {
        const { _id } = user;
        const dataToUpdate = getDiff(form, user);
        dispatch(updateUser(dataToUpdate, _id));
      }
    }
  };

  return (
    <>
      {(auth && ["user"].indexOf(auth.role) > -1) || (
        <Fab
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20%" }}
        >
          <AddIcon />
        </Fab>
      )}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {error ? <p style={{ textAlign: "center" }}>{error}</p> : ""}
        <DialogContent>
          <div className="">
            <form className={classes.form}>
              <DialogTitle id="form-dialog-title">
                {user ? "Update" : "Add"} User
              </DialogTitle>
              <div>
                <TextFieldHelper
                  nameNType={"email"}
                  label={"Email"}
                  autoComplete={"off"}
                  onChange={handleChange}
                  value={form.email}
                />
                <br />
                <TextFieldHelper
                  nameNType={"password"}
                  label={"Password"}
                  autoComplete={"off"}
                  onChange={handleChange}
                  value={form.password}
                />
                <br />
                <div className="form-group">
                  <InputLabel id="userRoleLabel">Role</InputLabel>
                  <Select
                    style={{ width: "100%" }}
                    labelId="userRoleLabel"
                    id="userRoleLabel"
                    value={form.role}
                    name="role"
                    onChange={handleChange}
                    className={classes.select}
                  >
                    {userRoles &&
                      userRoles.map((role) => (
                        <MenuItem value={role}>
                          {capitalizeFirstLetter(role)}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </div>
              <Grid container spacing={1} style={{ marginTop: "20px" }}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                  <Button
                    className=""
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserForm;
