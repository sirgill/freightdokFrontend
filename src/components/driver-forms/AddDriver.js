import React, { useEffect, useState } from "react";
// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDriver } from "../../actions/driver.js";
import { getLoads } from "../../actions/load";
//Material
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { TextFieldHelper, useStyles } from "../HelperCells.js";
import InputField from "../Atoms/form/InputField";
import {Button} from "@material-ui/core";
import {blue} from "../layout/ui/Theme";
import SubmitButton from "../Atoms/form/SubmitButton";

const AddDriverForm = ({
  user,
  addDriver,
  all_drivers,
  getLoads,
  load: { loads, allLoads, loading },
}) => {
  const classes = useStyles();

  const formTemplate = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    loads: [],
    user: "",
  };

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

  const handleClose = () => {
    setOpen(false);
    // setForm(formTemplate);
    setCount(1);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    addDriver(form);
    handleClose();
  };

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {(user && user.role === "afterhours") || (
        <Button
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20%" }}
          variant={'contained'}
        >
          Add Driver
        </Button>
      )}

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" sx={{color: blue, textAlign: 'center', fontWeight: 400, letterSpacing: 1}}>Add Driver</DialogTitle>
        <DialogContent>
          <div className="">
            <form className={classes.form}>
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
                    <InputField
                        value={form.user}
                        name="user"
                        onChange={updateForm}
                        className={classes.select}
                        label='Select Driver'
                        type={'select'}
                        showFirstBlank={true}
                        options={all_drivers.map(driver => ({id: driver._id, label: driver.email}))}
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
                        style={{width: '100%'}}
                      >
                        Submit
                      </SubmitButton>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </div>
              ) : null}
            </form>
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
  auth: { user },
  driver: { all_drivers },
}) => ({ load, user, all_drivers });

export default connect(mapStateToProps, { addDriver, getLoads })(AddDriverForm);
