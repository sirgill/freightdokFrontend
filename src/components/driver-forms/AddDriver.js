import React, { useEffect, useState } from "react";
// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDriver } from "../../actions/driver.js";
import { getLoads } from "../../actions/load";
//Material
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { TextFieldHelper, useStyles } from "../HelperCells.js";
import InputField from "../Atoms/form/InputField";
import {Button} from "reactstrap";

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
        <DialogContent>
          <div className="">
            <form className={classes.form}>
              {count === 1 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Add Driver</DialogTitle>

                  <div>
                    <InputField
                      name={"firstName"}
                      label={"First Name"}
                      onChange={(e) => updateForm(e)}
                      value={form.firstName}
                    />
                    <InputField
                      name={"lastName"}
                      label={"Last Name"}
                      onChange={(e) => updateForm(e)}
                      value={form.lastName}
                    />
                    <InputField
                      name={"phoneNumber"}
                      label={"Phone Number"}
                      onChange={(e) => updateForm(e)}
                      value={form.phoneNumber}
                    />

                    <div className="form-group">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">
                          Select Driver
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          value={form.user}
                          name="user"
                          onChange={(e) => updateForm(e)}
                          className={classes.select}
                        >
                          {all_drivers.map((driver) => (
                            <MenuItem key={driver._id} value={driver._id}>
                              {driver.email}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <Grid container spacing={1} style={{ marginTop: "20px" }}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <Button
                        className=""
                        type="submit"
                        color="primary"
                        onClick={onSubmit}
                        style={{width: '100%'}}
                      >
                        Submit
                      </Button>
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
