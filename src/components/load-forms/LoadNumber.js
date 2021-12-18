import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Paper,
  withStyles,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Face, Fingerprint } from "@material-ui/icons";
import { Link, withRouter } from "react-router-dom";
import { addLoad } from "../../actions/load";

const LoadForm = ({ addLoad }) => {
  const [formData, setFormData] = useState({
    brokerage: "",
    loadNumber: "",
  });

  const { brokerage, loadNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    addLoad(formData);
  };

  return (
    <Grid
      container
      style={{ marginTop: "150px" }}
      justify="center"
      alignItems="center"
    >
      <form onSubmit={(e) => onSubmit(e)}>
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item style={{ marginTop: "20px" }}>
            <Face />
          </Grid>
          <Grid item>
            <TextField
              id="brokerage"
              name="brokerage"
              type="text"
              label="brokerage"
              value={brokerage}
              onChange={(e) => onChange(e)}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          style={{ marginTop: "10px" }}
          justify="center"
          alignItems="center"
        >
          <Grid item style={{ marginTop: "20px" }}>
            <Fingerprint />
          </Grid>
          <Grid item>
            <TextField
              id="loadNumber"
              name="loadNumber"
              type="text"
              label="loadNumber"
              value={loadNumber}
              onChange={(e) => onChange(e)}
            />
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ marginTop: "20px" }}
        >
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            style={{ textTransform: "none" }}
          >
            submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

LoadForm.propTypes = {
  addLoad: PropTypes.func.isRequired,
};

export default connect(null, { addLoad })(withRouter(LoadForm));
