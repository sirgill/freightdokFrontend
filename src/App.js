import React from "react";
import axios from "axios";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Register from "./components/auth/Register";
import EntityType from "./components/auth/EntityType";
import OwnerOp from "./components/auth/OwnerOpRegister";
import Fleet from "./components/auth/FleetRegister";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import setAuthToken from "./utils/setAuthToken";
import Profile from "./components/users/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./components/layout/Notification";

import "./App.css";
import {getBaseUrl} from "./config";
import LandingPage from "./views/landingPage/LandingPage";
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
import UserOnboard from "./components/auth/signUpWithFMCSA/UserOnboard";
import LoadModuleAsync from "./components/Atoms/LoadModuleAsync";
import EnhancedDashboard from "./layout/EnhancedDashboard";
import {ENHANCED_DASHBOARD} from "./components/client/routes";

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
        <div className='root'>
            <Notification/>
            <BrowserRouter>
                <Switch>
                    <Route exact path={'/home'} component={LandingPage} />
                    <Route exact path={'/'}><Redirect to='/dashboard'/></Route>
                    <Route path="/entity" component={EntityType} />
                    <Route path="/ownerOperatorRegister" component={OwnerOp} />
                    <Route path="/fleetRegister" component={Fleet} />
                    <Route path='/setPassword' component={SetPassword} />
                    <PrivateRoute path="/profile" component={Profile}/>
                    <PrivateRoute path="/dashboard" component={Dashboard}/>
                    <PrivateRoute path={ENHANCED_DASHBOARD} component={EnhancedDashboard} />
                    {/*<PrivateRoute path='*'><Redirect to={ENHANCED_DASHBOARD} /></PrivateRoute>*/}
                    {/*<PrivateRoute path="/create-profile" component={ProfileForm}/>*/}
                    {/*<PrivateRoute path="/edit-profile" component={EditProfile}/>*/}
                    {/*<PrivateRoute path="/loads" component={Loads}/>*/}
                    <PreAuthRoutes/>
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
