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
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginRight: theme.spacing(1),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: 0,
    margin: 0
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  outside: {
    position: 'relative',
    marginTop: '15%'
  },
  bottomRight: {
    position: 'absolute',
    bottom: '10px',
    right: '10px'
  },
  bottomLeft: {
    position: 'absolute',
    bottom: '10px',
    left: '10px'
  },
  select: {
    "&:before": {
      borderColor: "#1891FC"
    },
    width: 195,
    padding: 0,
    margin: 0
  }
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#1891FC',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1891FC',
    },
    '& .MuiInput-underline:before': {
      borderColor: '#1891FC'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1891FC',
      },
      '&:hover fieldset': {
        borderColor: '#1891FC',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1891FC',
      },
    },
  },
})(TextField);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 350,
    },
  },
};

function getStyles(name, loads, theme) {
  return {
    fontWeight: loads.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const isPhoneNumber = (input) => {
  var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  if (input.match(phoneno)) {
    return true;
  } else {
    return false;
  }
};

const AddDriverForm = ({ user, addDriver, all_drivers, getLoads, load: { loads, allLoads, loading } }) => {
  const classes = useStyles();
  const theme = useTheme();

  const formTemplate = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    loads: [],
    user: ""
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

  const handleNext = () => {
    if (count === 1) {
      if (!isPhoneNumber(form.phoneNumber)) {
        alert("Please Submit a phone number in this format: XXX-XXX-XXXX");
        return;
      }
    }
    setCount((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setCount((prevActiveStep) => prevActiveStep - 1);
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

  const handleLoadsChange = (e) => {
    setForm({
      ...form,
      loads: [...e.target.value],
    });
  };
  return (
    <>
      { (user && user.role === 'afterhours') || <Fab color="primary" onClick={handleClickOpen} style={{marginBottom: '20%'}}>
        <AddIcon />
      </Fab> }

      <Dialog fullWidth={true} maxWidth={"sm"} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        
        <DialogContent>
          <div className="">
            <form className={classes.form}>
              {count === 1 ? (
                <div>
                  <DialogTitle id="form-dialog-title">Add Driver</DialogTitle>

                  <div>
                    <div className="form-group">
                      <CssTextField
                        id="outlined-basic"
                        type="firstName"
                        className="form-control"
                        name="firstName"
                        label="First Name"
                        onChange={(e) => updateForm(e)}
                        value={form.firstName}
                        style={{ marginRight: "10px" }}
                      />
                    </div>

                    <div className="form-group">
                      <CssTextField
                        id="outlined-basic"
                        type="lastName"
                        className="form-control"
                        name="lastName"
                        label="Last Name"
                        onChange={(e) => updateForm(e)}
                        value={form.lastName}
                      />
                    </div>

                    <div className="form-group">
                      <CssTextField
                        id="outlined-basic"
                        type="phoneNumber"
                        className="form-control"
                        name="phoneNumber"
                        label="Phone Number"
                        onChange={(e) => updateForm(e)}
                        value={form.phoneNumber}
                      />
                    </div>

                    <div className="form-group">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Select Driver</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          value={form.user}
                          name="user"
                          onChange={(e) => updateForm(e)}
                          className={classes.select}
                        >
                          {all_drivers.map((driver) => (
                            <MenuItem key={driver._id} value={driver._id}>
                              { driver.email }
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  
                  <Grid container spacing={1} style={{ marginTop: "20px" }}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Button className="" type="submit" variant="outlined" color="primary"  onClick={onSubmit}>
                            Submit
                        </Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
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

const mapStateToProps = ({ load, auth: { user }, driver: { all_drivers } }) => ({ load, user, all_drivers });

export default connect(mapStateToProps, { addDriver, getLoads })(AddDriverForm);
