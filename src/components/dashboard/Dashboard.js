import React, {Fragment, useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@mui/material/Typography";
import {useTheme} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Loadcard} from "../loadcard/Loadcard.js";
import AddLoadForm from "../load-forms/AddLoad.js";
import Loadlistbar from "../loadbar/Loadlistbar.js";
import Driverlistbar from "../driverbar/Driverlistbar.js";
import AddDriverForm from "../driver-forms/AddDriver.js";
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
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
import {capitalizeFirstLetter} from "../../utils/helper";
import CustomTextField from "../Atoms/CustomTextField";
import {blue} from "../layout/ui/Theme";
import "../../assets/vendor/nucleo/css/nucleo.css";
import Settings from "../../views/settings/Settings.js";
import OwnerOperator from "../../views/ownerOperator/OwnerOperator";
import OpenBoard from "../../views/openBoard/OpenBoard.js";
import OpenBoardIcon from '../../assets/icons/openBoard.svg'
import InvoiceIcon from '../../assets/icons/icons8-invoices-24.png'
import FacilitiesIcon from '../../assets/icons/icons8-warehouse-24.png'
import LoadHistoryIcon from '../../assets/icons/icons8-bulleted-list-24.png'
import MyLoads from '../../assets/icons/icons8-delivered-24.png'
import OwnerOperatorIcon from '../../assets/icons/icons8-engineer-24.png'
import DriverIcon from '../../assets/icons/icons8-driver-24.png'
import UsersIcon from '../../assets/icons/icons8-user-account-24.png'
import CarrierProfileIcon from '../../assets/icons/settings-18-1-1-1-1-1.svg'
import LogoutIcon from '../../assets/icons/icons8-logout-24.png'
import CarrierProfile from "../../views/carrierProfile/CarrierProfile";

const Dashboard = ({
                       auth: {isAuthenticated, user = {}},
                       logout,
                       container,
                       getLoads,
                       getCurrentProfile,
                       profile: {profile, loading},
                       invoiceGenerated,
                       history,
                   }) => {
    const [listBarType, setListBarType] = React.useState("Open Load Board");

    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const {page, limit} = useSelector((state) => state.load.search);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [in_progress, setInProgress] = useState(false);
    const [load_selected, setSelectedLoad] = useState(null),
        {path} = useRouteMatch();

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

    const goToHome = useCallback(() => {
        history.push('/home')
    }, [])

    const resetSearchField = () => setSearch("");
    const drawer = (
        <Fragment>
            <div className={classes.profile}>
                {/*<div className={classes.toolbar} />*/}
                <Grid
                    container
                    spacing={24}
                    justify="center"
                    style={{minHeight: "100vh", maxWidth: "100%"}}
                >
                    <Typography onClick={goToHome} sx={{
                        color: '#fff',
                        fontWeight: 900,
                        mt: 4,
                        fontSize: 25,
                        cursor: 'pointer'
                    }}>freightdok</Typography>
                    {/*Below component is  commented will be removed in future*/}
                    {/*<Grid item align="center">*/}
                    {/*  /!* Setting the Avatar for Username. *!/*/}
                    {/*  {profile && profile.imageUrl ? (*/}
                    {/*    <div className="form-field">*/}
                    {/*      <div*/}
                    {/*        className="form-profile-image"*/}
                    {/*        style={{ textAlign: "center" }}*/}
                    {/*      >*/}
                    {/*        <img*/}
                    {/*          src={profile.imageUrl}*/}
                    {/*          alt="main-logo"*/}
                    {/*          style={{*/}
                    {/*            width: "60px",*/}
                    {/*            height: "60px",*/}
                    {/*            objectFit: "cover",*/}
                    {/*            borderRadius: "100%",*/}
                    {/*          }}*/}
                    {/*        />*/}
                    {/*      </div>*/}
                    {/*    </div>*/}
                    {/*  ) : (*/}
                    {/*    <Avatar className={classes.avatar} component={Link} to="/profile">*/}
                    {/*      H*/}
                    {/*    </Avatar>*/}
                    {/*  )}*/}

                    {/*  <Typography className={classes.username} gutterBottom>*/}
                    {/*    {profile ? profile.name : ""}*/}
                    {/*  </Typography>*/}
                    {/*</Grid>*/}
                </Grid>
            </div>
            {/* Setting the Left Sidebar */}
            <List sx={{px: 3, height: 'calc(100% - 277px)', overflow: 'auto', mt: 2}}>
                <ListItemHelper
                    onClick={() => {
                        setListBarType("Open Load Board");
                    }}
                    icon={OpenBoardIcon}
                    primary={"Open Load Board"}
                    listBarType={listBarType}
                />
                <ListItemHelper
                    onClick={() => {
                        setListBarType("My Loads");
                    }}
                    icon={MyLoads}
                    primary={"My Loads"}
                    listBarType={listBarType}
                />
                {/* <ListItemHelper
          onClick={() => {
            setListBarType("load Status");
          }}
          icon={
            <i className="ni ni-ungroup font-25" style={{ color: "#FB6340" }} />
          }
          primary={"Load Status"}
          listBarType={listBarType}
        /> */}
                {user && user.role === "admin" && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("invoices");
                        }}
                        icon={InvoiceIcon}
                        primary={"Invoices"}
                        listBarType={listBarType}
                    />
                )}
                {user && (user.role === "admin" || user.role === "dispatch") && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("users");
                        }}
                        icon={UsersIcon}
                        primary={"Users"}
                        listBarType={listBarType}
                    />
                )}
                {user && (user.role === "admin" || user.role === "dispatch") && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("drivers");
                        }}
                        icon={DriverIcon}
                        primary={"Drivers"}
                        listBarType={listBarType}
                    />
                )}
                {user && (user.role === "admin" || user.role === "dispatch") && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("ownerOp");
                        }}
                        icon={OwnerOperatorIcon}
                        primary={"Owner Operators"}
                        listBarType={listBarType}
                    />
                )}
                {user && user.role === "admin" && (
                    <ListItemHelper
                        onClick={() => {
                            setListBarType("history");
                        }}
                        icon={LoadHistoryIcon}
                        primary={"Load History"}
                        listBarType={listBarType}
                    />
                )}
                {false && (
                    <ListItemHelper
                        component={Link}
                        to={"/edit-profile"}
                        icon={
                            <i
                                className="ni ni-settings-gear-65 font-25"
                                style={{color: "#172B4D"}}
                            />
                        }
                        primary={"Account"}
                        listBarType={listBarType}
                        className="accountDashboardLink"
                    />
                )}
                <ListItemHelper
                    onClick={() => {
                        setListBarType("facilities");
                    }}
                    icon={FacilitiesIcon}
                    primary={"Facilities"}
                    listBarType={listBarType}
                />
                <ListItemHelper
                    onClick={() => {
                        setListBarType("carrierProfile");
                    }}
                    icon={CarrierProfileIcon}
                    primary={"Carrier Profile"}
                    listBarType={listBarType}
                    title='Carrier Profile'
                />
                <ListItemHelper
                    icon={LogoutIcon}
                    onClick={logout}
                    primary={"Logout"}
                />
            </List>
        </Fragment>
    );

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                elevation={0}
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
                    <Typography className={classes.tab} sx={{fontWeight: 700, fontSize: 20}}>
                        {capitalizeFirstLetter(listBarType || "")}
                    </Typography>
                    {listBarType === "invoices" || listBarType === "Open Load Board" || (
                        <div className={classes.loadSearchbar}>
                            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <CustomTextField
                                    label="Search"
                                    value={search}
                                    onChange={({target: {value}}) => setSearch(value)}
                                    placeholder={"Search"}
                                    style={{width: 250}}
                                    className='searchDashboard'
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
                <Switch>
                    <Route exact path={path + "/user/settings"} component={Settings}/>
                </Switch>
                <Grid item>
                    <Alert/>
                </Grid>
                <Grid item xs={12}>
                    {listBarType === "Open Load Board" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <OpenBoard resetSearchField={resetSearchField}/>
                            {/* <div className={classes.fab}>
                                {(user && user.role === "driver") || (
                                    <AddLoadForm/>
                                )}
                            </div> */}
                        </main>
                    )}
                    {listBarType === "My Loads" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <Loadlistbar resetSearchField={resetSearchField}/>
                            <div className={classes.fab}>
                                {(user && user.role === "driver") || <AddLoadForm/>}
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
                    {listBarType === "ownerOp" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <OwnerOperator/>
                            {/*<div className={classes.fab}>*/}
                            {/*  <OwnerOpForm />*/}
                            {/*</div>*/}
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
                    {listBarType === "carrierProfile" && (
                        <main className={classes.contentLoadList}>
                            <div className={classes.toolbar}/>
                            <CarrierProfile
                                resetSearchField={resetSearchField}
                                listBarType={listBarType}
                            />
                        </main>
                    )}
                </Grid>

                {/*<Grid item>*/}
                {/*    {listBarType === "loads" && (*/}
                {/*        <main className={classes.contentLoadList}>*/}
                {/*            <div className={classes.toolbar}/>*/}
                {/*            <Loadcard className={classes.loadcard}/>*/}
                {/*        </main>*/}
                {/*    )}*/}
                {/*</Grid>*/}
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
