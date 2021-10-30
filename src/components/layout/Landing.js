import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import theme from "./ui/Theme";

const useStyles = makeStyles(theme => ({
  mainContainer: {
    marginTop: "5em",
    [theme.breakpoints.down("md")]: {
      marginTop: "3em",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "2em",
    }
  },
  heroTextContainer: {
    minWidth: "21.5em",
    marginLeft:"1em",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  }

}));

export default function Landing() {
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <Grid item>
        <Grid container justify="flex-end" alignItems="center" direction="row">
          <Grid sm item className={classes.heroTextContainer}>
          <Typography variant="h2" align="center">
            Streamlining freight workflows
            </Typography>
            <Grid container justify="center">
              <Grid item>
              <Typography>
                This will be example text until we can figure out some lines to fill this space
              </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid sm item>
            <div> side item </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
};
