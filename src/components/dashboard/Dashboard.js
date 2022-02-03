import React, {Fragment, useEffect, useState} from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import History from "@material-ui/icons/History";
import List from "@mui/material/List";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {useTheme} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Loadcard} from "../loadcard/Loadcard.js";
import AddLoadForm from "../load-forms/AddLoad.js";
import Loadlistbar from "../loadbar/Loadlistbar.js";
import Driverlistbar from "../driverbar/Driverlistbar.js";
import AddDriverForm from "../driver-forms/AddDriver.js";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {connect} from "react-redux";
import {logout} from "../../actions/auth";
import {getCurrentProfile} from "../../actions/profile";
import UsersList from "../users/UsersList";
import UserForm from "../users/UserForm";
import Alert from "../layout/Alert";
import LoadsStatus from "../loads/LoadsStatus";
import {Warehouse} from "../warehouse/Warehouse";
import {getLoads} from "../../actions/load";
import {useDispatch, useSelector} from "react-redux";
import {searchLoads, resetLoadsSearch} from "../../actions/load.js";
import InvoicesList from "../invoices/InvoicesList";
import InvoicesWizard from "../invoices/InvoicesWizard";
import {useStyles, ListItemHelper} from "../HelperCells";
import {capitalizeFirstLetter} from '../../utils/helper';
import CustomTextField from "../Atoms/CustomTextField";
import {blue} from "../layout/ui/Theme";
import '../../assets/vendor/nucleo/css/nucleo.css';

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

    const {page, limit} = useSelector((state) => state.load.search);
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
                <div className={classes.toolbar}/>
                <Grid
                    container
                    spacing={24}
                    justify="center"
                    style={{minHeight: "100vh", maxWidth: "100%"}}
                >
                    <Grid item align="center">
                        {/* Setting the Avatar for Username. */}
                        {profile && profile.imageUrl ? (
                            <div className="form-field">
                                <div
                                    className="form-profile-image"
                                    style={{textAlign: "center"}}
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
            <List sx={{pr: 3}}>
                <ListItemHelper
                    onClick={() => {
                        setListBarType("loads");
                    }}
                    icon={<i className={'ni ni-delivery-fast loadsIcon font-25'}/>}
                    primary={"Loads"}
                    listBarType={listBarType}
                />
                <ListItemHelper
                    onClick={() => {
                        setListBarType("load Status");
                    }}
                    icon={<i className='ni ni-ungroup font-25' style={{color: '#FB6340'}}/>}
                    primary={"Load Status"}
                    listBarType={listBarType}
                />
                {user && user.role === "admin" && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("invoices");
                        }}
                        icon={<i className='ni ni-single-copy-04 font-25' style={{color: '#F3A4B5'}}/>}
                        primary={"Invoices"}
                        listBarType={listBarType}
                    />
                )}
                {user && (user.role === "admin" || user.role === "dispatch") && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("drivers");
                        }}
                        icon={<i className='ni ni-badge font-25' style={{color: '#2DCE89'}}/>}
                        primary={"Drivers"}
                        listBarType={listBarType}
                    />
                )}
                {user && (user.role === "admin" || user.role === "dispatch") && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("users");
                        }}
                        icon={<i className='ni ni-circle-08 font-25' style={{color: '#16294A'}}/>}
                        primary={"Users"}
                        listBarType={listBarType}
                    />
                )}
                {user && user.role === "admin" && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("history");
                        }}
                        icon={<i className='ni ni-bag-17 font-25' style={{color: '#5E72E4'}}/>}
                        primary={"History"}
                        listBarType={listBarType}
                    />
                )}
                <ListItemHelper
                    component={Link}
                    to={"/edit-profile"}
                    icon={<i className='ni ni-settings-gear-65 font-25' style={{color: '#172B4D'}}/>}
                    primary={"Account"}
                    listBarType={listBarType}
                    className='accountDashboardLink'
                />
                <ListItemHelper
                    onClick={() => {
                        setListBarType("facilities");
                    }}
                    icon={<i className='ni ni-building facilityIcon'/>}
                    primary={"Facilities"}
                    listBarType={listBarType}
                />
                <ListItemHelper icon={<i className='ni ni-curved-next font-25' style={{color: blue}}/>} onClick={logout} primary={"Logout"}/>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline/>
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
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={classes.tab}>
                        {capitalizeFirstLetter(listBarType || '')}
                    </Typography>
                    {listBarType === "invoices" || (
                        <div className={classes.loadSearchbar}>
                            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <CustomTextField
                                    label="Search"
                                    value={search}
                                    onChange={({target: {value}}) => setSearch(value)}
                                    placeholder={'Search'}
                                    style={{width: 250}}
                                />
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
                        classes={{paper: classes.drawerPaper}}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{paper: classes.drawerPaper}}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>

            <Grid container className={classes.dashboardContainer}>
                <Grid item>
                    <Alert/>
                </Grid>
                <Grid item xs={12}>
                    {listBarType === "loads" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <Loadlistbar resetSearchField={resetSearchField}/>
                            <div className={classes.fab}>
                                {(user && user.role === "driver") || (
                                    <AddLoadForm/>
                                )}
                            </div>
                        </main>
                    )}
                    {listBarType === "load Status" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <LoadsStatus
                                resetSearchField={resetSearchField}
                                listBarType={listBarType}
                            />
                        </main>
                    )}
                    {listBarType === "invoices" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
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
                                        setSelectedLoad((load) => ({...load, [doc_type]: []}))
                                    }
                                    handleOnClose={() => setSelectedLoad(null)}
                                />
                            </div>
                        </main>
                    )}
                    {listBarType === "facilities" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <Warehouse resetSearchField={resetSearchField}/>
                        </main>
                    )}
                    {listBarType === "drivers" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <Driverlistbar/>
                            <div className={classes.fab}>
                                <AddDriverForm/>
                            </div>
                        </main>
                    )}
                    {listBarType === "users" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <UsersList/>
                            <div className={classes.fab}>
                                <UserForm/>
                            </div>
                        </main>
                    )}
                    {listBarType === "history" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
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
                            <div className={classes.toolbar}/>
                            <Loadcard className={classes.loadcard}/>
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
