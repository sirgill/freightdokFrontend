import React from "react";
import {Link} from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Hidden from '@material-ui/core/Hidden';


const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.common.white,
    width: "100%",
    zIndex: 1302,
    position: "relative"
  },
  mainContainer: {
    position: "absolute"
  },
  link: {
    color: "#1891FC",
    fontFamily: "Myriad Pro",
    fontSize: "0.75rem",
    fontWeight: 300,
    textDecoration: "none"
  },
  gridItem: {
    margin: "3em"
  }
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
    <Hidden mdDown>
      <Grid container justify="center" className={classes.mainContainer}>
        <Grid item className={classes.gridItem}>
          <Grid container direction="column">
            <Grid item component={Link} to="/" className={classes.link}>
              home
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Grid container direction="column">
            <Grid item component={Link} to="/about" className={classes.link}>
              about us
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Grid container direction="column">
            <Grid item component={Link} to="/contact" className={classes.link}>
              contact
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Hidden>
    </footer>
  );
}
