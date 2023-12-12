import React from "react";
import axios from "axios";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import EntityType from "./components/auth/EntityType";
// import OwnerOp from "./components/auth/OwnerOpRegister";
// import Fleet from "./components/auth/FleetRegister";
// import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import setAuthToken from "./utils/setAuthToken";
// import Profile from "./components/users/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./components/layout/Notification";

import "./App.css";
import {getBaseUrl} from "./config";
import SetPassword from "./components/auth/SetPassword";
import SignUp from "./components/auth/signUpWithFMCSA/SignUp";
import {
    FEDERAL_SIGNUP_LINK,
    FMCSA_VERIFICATION_LINK,
    LOGIN_LINK,
    ONBOARDING_USER,
    SIGNUP_SUPPORT
} from "./components/constants";
import Support from "./components/auth/signUpWithFMCSA/Support";
import LoadModuleAsync from "./components/Atoms/LoadModuleAsync";
import {ENHANCED_DASHBOARD} from "./components/client/routes";
import {Box} from "@mui/material";

const Register = LoadModuleAsync(() => import("./components/auth/Register"));
const LandingPage = LoadModuleAsync(() => import("./views/landingPage/LandingPage"));
const UserOnboard = LoadModuleAsync(() => import("./components/auth/signUpWithFMCSA/UserOnboard")) ;
const EnhancedDashboard = LoadModuleAsync(() => import("./layout/EnhancedDashboard"), true);
const Login = LoadModuleAsync(() => import('./components/auth/Login'), true);
const FMCSASignup = LoadModuleAsync(() => import("./components/auth/signUpWithFMCSA/FMCSASignup"), true)

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

axios.defaults.baseURL = getBaseUrl();

const PreAuthRoutes = () => {
    return <>
        <Route path="/register" component={Register}/>
        <Route path={LOGIN_LINK} component={Login}/>
        <Route path={FEDERAL_SIGNUP_LINK} component={SignUp}/>
        <Route path={FMCSA_VERIFICATION_LINK} component={FMCSASignup}/>
        <Route path={SIGNUP_SUPPORT} component={Support}/>
        <Route path={ONBOARDING_USER} component={UserOnboard}/>
    </>
}

const App = () => {
    return (
        <Box sx={{height: '100%'}} className='app'>
            <Notification/>
            <BrowserRouter>
                <Switch>
                    <Route exact path={'/'}><Redirect to={ENHANCED_DASHBOARD} /></Route>
                    <Route path={'/home'} component={LandingPage} />
                    <Route path="/entity" component={EntityType} />
                    {/*<Route path="/ownerOperatorRegister" component={OwnerOp} />*/}
                    <Route path='/setPassword' component={SetPassword} />
                    <PrivateRoute path={ENHANCED_DASHBOARD} component={EnhancedDashboard} />
                    {/*<PrivateRoute path="/dashboard" component={Dashboard}/>*/}
                    {/*<PrivateRoute path="/profile" component={Profile}/>*/}
                    {/*<Route path="/fleetRegister" component={Fleet} />*/}
                    {/*<PrivateRoute path='*'><Redirect to={ENHANCED_DASHBOARD} /></PrivateRoute>*/}
                    {/*<PrivateRoute path="/create-profile" component={ProfileForm}/>*/}
                    {/*<PrivateRoute path="/edit-profile" component={EditProfile}/>*/}
                    {/*<PrivateRoute path="/loads" component={Loads}/>*/}
                    <PreAuthRoutes/>
                </Switch>
            </BrowserRouter>
        </Box>
    );
};

export default App;
