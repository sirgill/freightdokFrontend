import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import CalendarToday from "@material-ui/icons/CalendarToday";
import People from "@material-ui/icons/People";
import HorizontalSplit from "@material-ui/icons/HorizontalSplit";
import Receipt from "@material-ui/icons/Receipt";
import History from "@material-ui/icons/History";
import Block from "@material-ui/icons/Block";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Loadcard } from "../loadcard/Loadcard.js";
import AddLoadForm from "../load-forms/AddLoad.js";
import Loadlistbar from "../loadbar/Loadlistbar.js";
import { Driverlistbar } from "../driverbar/Driverlistbar.js";
import AddDriverForm from "../driver-forms/AddDriver.js";
import { Link } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { getCurrentProfile } from "../../actions/profile";
import UsersList from "../users/UsersList";
import UserForm from "../users/UserForm";
import Alert from "../layout/Alert";
import LoadsStatus from "../loads/LoadsStatus";
import { Warehouse } from "../warehouse/Warehouse";
import { getLoads } from "../../actions/load";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { searchLoads, resetLoadsSearch } from "../../actions/load.js";
import InvoicesList from "../invoices/InvoicesList";
import InvoicesWizard from "../invoices/InvoicesWizard";
import { HouseOutlined } from "@material-ui/icons";
import { useStyles, ListItemHelper } from "../HelperCells";

const Dashboard = ({
  auth: { isAuthenticated, user = {} },
  logout,
  container,
  getLoads,
  getCurrentProfile,
  profile: { profile, loading },
  match,
  invoiceGenerated,
}) => {
  const [listBarType, setListBarType] = React.useState("loads");

  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { page, limit } = useSelector((state) => state.load.search);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [in_progress, setInProgress] = useState(false);
  const [load_selected, setSelectedLoad] = useState(null);

  useEffect(() => {
    getCurrentProfile();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!in_progress) dispatch(searchLoads(+page, +limit, search, listBarType));
  };

  useEffect(() => {
    if (!in_progress && search !== "")
      dispatch(searchLoads(+page, +limit, search, listBarType));
    if (!search) dispatch(resetLoadsSearch(listBarType));
  }, [in_progress]);

  const handleSearch = () => {
    if (!in_progress) {
      setInProgress(true);
      setTimeout(() => {
        setInProgress(false);
      }, 1000);
    }
  };

  const resetSearchField = () => setSearch("");
  const drawer = (
    <div>
      <div className={classes.profile}>
        <div className={classes.toolbar} />
        <Grid
          container
          spacing={24}
          justify="center"
          style={{ minHeight: "100vh", maxWidth: "100%" }}
        >
          <Grid item align="center">
            {/* Setting the Avatar for Username. */}
            {profile && profile.imageUrl ? (
              <div className="form-field">
                <div
                  className="form-profile-image"
                  style={{ textAlign: "center" }}
                >
                  <img
                    src={profile.imageUrl}
                    alt="main-logo"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "100%",
                    }}
                  />
                </div>
              </div>
            ) : (
              <Avatar className={classes.avatar} component={Link} to="/profile">
                H
              </Avatar>
            )}

            <Typography className={classes.username} gutterBottom>
              {profile ? profile.name : ""}
            </Typography>
          </Grid>
        </Grid>
      </div>
      {/* Setting the Left Sidebar */}
      <List>
        <ListItemHelper
          onClick={() => {
            setListBarType("loads");
          }}
          icon={<CalendarToday />}
          primary={"Loads"}
        />
        <ListItemHelper
          onClick={() => {
            setListBarType("warehouse");
          }}
          icon={<HouseOutlined />}
          primary={"Warehouse"}
        />
        {user && (user.role === "admin" || user.role === "dispatch") && (
          <ListItemHelper
            onClick={() => {
              setListBarType("drivers");
            }}
            icon={<People />}
            primary={"Drivers"}
          />
        )}
        <ListItemHelper
          onClick={() => {
            setListBarType("loadsStatus");
          }}
          icon={<HorizontalSplit />}
          primary={"Load Status"}
        />
        {user && (user.role === "admin" || user.role === "dispatch") && (
          <ListItemHelper
            onClick={() => {
              setListBarType("users");
            }}
            icon={<People />}
            primary={"Users"}
          />
        )}
        {user && user.role === "admin" && (
          <ListItemHelper
            onClick={() => {
              setListBarType("invoices");
            }}
            icon={<Receipt />}
            primary={"Invoices"}
          />
        )}
        {user && user.role === "admin" && (
          <ListItemHelper
            onClick={() => {
              setListBarType("history");
            }}
            icon={<History />}
            primary={"History"}
          />
        )}
        <ListItemHelper
          component={Link}
          to={"/edit-profile"}
          icon={<AccountCircle />}
          primary={"Account"}
        />
        <ListItemHelper icon={<Block />} onClick={logout} primary={"Logout"} />
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        color="secondary"
        className={classes.appBar}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography className={classes.tab}>
              Schedules
            </Typography> */}
          {listBarType === "invoices" || (
            <div className={classes.loadSearchbar}>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  style={{ backgroundColor: "#fff", height: 50 }}
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={({ target: { value } }) => setSearch(value)}
                />
                <Button
                  style={{ marginLeft: 15 }}
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </form>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <Grid container className={classes.dashboardContainer}>
        <Grid item>
          <Alert />
        </Grid>
        <Grid item xs={12}>
          {listBarType === "loads" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <Loadlistbar resetSearchField={resetSearchField} />
              <div className={classes.fab}>
                {(user && user.role === "driver") || (
                  <AddLoadForm></AddLoadForm>
                )}
              </div>
            </main>
          )}
          {listBarType === "warehouse" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <Warehouse resetSearchField={resetSearchField} />
            </main>
          )}
          {listBarType === "loadsStatus" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <LoadsStatus
                resetSearchField={resetSearchField}
                listBarType={listBarType}
              />
            </main>
          )}
          {listBarType === "drivers" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <Driverlistbar />
              <div className={classes.fab}>
                <AddDriverForm></AddDriverForm>
              </div>
            </main>
          )}
          {listBarType === "users" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <UsersList />
              <div className={classes.fab}>
                <UserForm />
              </div>
            </main>
          )}
          {listBarType === "invoices" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <InvoicesList
                resetSearchField={resetSearchField}
                listBarType={listBarType}
                setSelectedLoad={(data) => setSelectedLoad(data)}
              />
              <div className={classes.fab}>
                <InvoicesWizard
                  invoiceGenerated={invoiceGenerated}
                  load_selected={load_selected}
                  updateDoc={(doc_type, documents) =>
                    setSelectedLoad((load) => ({
                      ...load,
                      [doc_type]: documents,
                    }))
                  }
                  deleteDoc={(doc_type) =>
                    setSelectedLoad((load) => ({ ...load, [doc_type]: [] }))
                  }
                  handleOnClose={() => setSelectedLoad(null)}
                />
              </div>
            </main>
          )}
          {listBarType === "history" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <LoadsStatus
                resetSearchField={resetSearchField}
                listBarType={listBarType}
              />
            </main>
          )}
        </Grid>

        <Grid item>
          {listBarType === "loads" && (
            <main className={classes.contentLoadList}>
              <div className={classes.toolbar} />
              <Loadcard className={classes.loadcard} />
            </main>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  invoiceGenerated: state.load.invoiceGenerated,
});

export default connect(mapStateToProps, {
  logout,
  getCurrentProfile,
  getLoads,
})(Dashboard);
