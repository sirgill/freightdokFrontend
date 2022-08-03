import React, { Fragment, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, Divider, Stack, Link, Typography } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import { Redirect, useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import "./authcss/LoginRegister.css";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import EmailIcon from "@material-ui/icons/Email";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { makeStyles } from "@material-ui/core/styles";

import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from "reactstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    width: "445px",
    margin: "auto",
    background: "#F7FAFC 0% 0% no-repeat padding-box",
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    borderRadius: "6px",
    transition: "all 0.3s",
  },
  typography: {
    color: "#0091FF",
    fontSize: "45px",
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 35px)",
  },
  gridTop: {
    position: "relative",
    height: "100px",
  },
  gridBottom: {
    padding: "5rem 2rem",
  },
}));
const verticalAlignStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const EntityType = (props) => {
  const dispatch = useDispatch(),
    history = useHistory();
  const classes = useStyles();

  return (
    <Fragment>
      <Box sx={{ position: "relative" }} className={"landingPageContainer"}>
        <Box component="main" p={8}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Typography sx={{ color: "#0091FF", fontSize: 32, fontWeight: 700 }}>
              freightdok.
            </Typography>
          </Stack>
          <Fragment>
              <section className="login">
                <div className="auth-wrapper" style={verticalAlignStyle}>
                  <Grid container className={classes.root} direction="row">
                    <Grid item xs={12} className={classes.gridTop}>
                      <Typography sx={{ color: "#0091FF", fontSize: 25, fontWeight: 700, position: "absolute", left: "50%", transform: "translate(-50%, 35px)"}}>
                        Account Type
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ height: "fit-content" }}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className={classes.gridBottom}
                      style={{ textAlign: "center" }}
                    >
                      {/* <Button type="submit" variant="contained" color="primary" style={{ marginTop: '5%' }} >Sign in</Button> */}
                      <Box style={{ display: "flex", gap: "1rem" }}>
                      <Button variant="contained" type="submit" style={{ width: 300, height: 100 }} href="/owneroperatorregister">
                        Owner Operator
                      </Button>

                      <br />
                      <br />
                      <Button variant="contained" type="submit" style={{ width: 300, height: 100 }} href="/fleetregister">
                        Fleet Owner
                      </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </section>

          </Fragment>

        </Box>
      </Box>
    </Fragment>
  );
};

EntityType.propTypes = {
  login: PropTypes.func.isRequired,
};

export default EntityType;
