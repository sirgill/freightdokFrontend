import React, {Fragment, useEffect} from "react";
import axios from "axios";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import EntityType from "./components/auth/EntityType";
import OwnerOp from "./components/auth/OwnerOpRegister";
import Fleet from "./components/auth/FleetRegister";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import ProfileForm from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";

import Loads from "./components/loads/Loads";

import store from "./store";
import {loadUser} from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Profile from "./components/users/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./components/layout/Notification";

import "./App.css";
import {getBaseUrl} from "./config";
import LandingPage from "./views/landingPage/LandingPage";
import SetPassword from "./components/auth/SetPassword";
import SignUp from "./components/auth/signUpWithFMCSA/SignUp";
import {FEDERAL_SIGNUP_LINK, FMCSA_VERIFICATION_LINK, ONBOARDING_USER, SIGNUP_SUPPORT} from "./components/constants";
import Support from "./components/auth/signUpWithFMCSA/Support";
import UserOnboard from "./components/auth/signUpWithFMCSA/UserOnboard";
import LoadModuleAsync from "./components/Atoms/LoadModuleAsync";

const Login = LoadModuleAsync(() => import('./components/auth/Login'));
const FMCSASignup = LoadModuleAsync(() => import("./components/auth/signUpWithFMCSA/FMCSASignup"))

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

axios.defaults.baseURL = getBaseUrl();

const PreAuthRoutes = () => {
    return <>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path={FEDERAL_SIGNUP_LINK} component={SignUp}/>
        <Route path={FMCSA_VERIFICATION_LINK} component={FMCSASignup}/>
        <Route path={SIGNUP_SUPPORT} component={Support}/>
        <Route path={ONBOARDING_USER} component={UserOnboard}/>
    </>
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);
    return (
        <Fragment>
            <Notification/>
            <BrowserRouter>
                <Switch>
                    <Route exact path={'/home'} component={LandingPage} />
                    <Route path="/entity" component={EntityType} />
                    <Route path="/ownerOperatorRegister" component={OwnerOp} />
                    <Route path="/fleetRegister" component={Fleet} />
                    <Route path='/setPassword' component={SetPassword} />
                    <PrivateRoute path="/profile" component={Profile}/>
                    <PrivateRoute path="/dashboard" component={Dashboard}/>
                    <PrivateRoute path="/create-profile" component={ProfileForm}/>
                    <PrivateRoute path="/edit-profile" component={EditProfile}/>
                    <PrivateRoute path="/loads" component={Loads}/>
                    <PreAuthRoutes/>
                    <Route exact path={'/'}><Redirect to='/dashboard'/></Route>
                </Switch>
            </BrowserRouter>
        </Fragment>
    );
};

export default App;
