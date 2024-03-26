import React, {Fragment} from "react";
import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import "./authcss/LoginRegister.css";
import Grid from "@mui/material/Grid";

const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const EntityType = () => {

    return (
        <Fragment>
            <Box sx={{position: "relative"}} className={"landingPageContainer"}>
                <Box component="main" p={8}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems={"center"}
                    >
                        <Typography sx={{color: "#0091FF", fontSize: 32, fontWeight: 700}}>
                            freightdok.
                        </Typography>
                    </Stack>
                    <Fragment>
                        <section className="login">
                            <div className="auth-wrapper" style={verticalAlignStyle}>
                                <Grid container sx={{
                                    textAlign: "center",
                                    width: "445px",
                                    margin: "auto",
                                    background: "#F7FAFC 0% 0% no-repeat padding-box",
                                    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
                                    borderRadius: "6px",
                                    transition: "all 0.3s",
                                }} direction="row">
                                    <Grid item xs={12} sx={{
                                        position: "relative",
                                        height: "100px",
                                    }}>
                                        <Typography sx={{
                                            color: "#0091FF",
                                            fontSize: 25,
                                            fontWeight: 700,
                                            position: "absolute",
                                            left: "50%",
                                            transform: "translate(-50%, 35px)"
                                        }}>
                                            Account Type
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{height: "fit-content"}}>
                                        <Divider/>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            padding: "5rem 2rem",
                                        }}
                                        style={{textAlign: "center"}}
                                    >
                                        {/* <Button type="submit" variant="contained" color="primary" style={{ marginTop: '5%' }} >Sign in</Button> */}
                                        <Box style={{display: "flex", gap: "1rem"}}>
                                            <Button variant="contained" type="submit" sx={{
                                                width: 300, height: 100, "&.MuiButton-contained:hover": {color: '#fff'}
                                            }} component={Link} to="/ownerOperatorRegister">
                                                Owner Operator
                                            </Button>

                                            <br/>
                                            <br/>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                sx={{
                                                    width: 300,
                                                    height: 100,
                                                    "&.MuiButton-contained:hover": {color: '#fff'}
                                                }}
                                                component={Link}
                                                to="/fleetRegister"
                                            >
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
