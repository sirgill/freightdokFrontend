import React, {Fragment, useEffect} from "react";
import axios from "axios";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
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
import FMCSAVerification from "./components/auth/signUpWithFMCSA/FMCSAVerification";
import {FEDERAL_SIGNUP_LINK, FMCSA_VERIFICATION_LINK} from "./components/constants";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

axios.defaults.baseURL = getBaseUrl();

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);
    return (
        <Fragment>
            <Notification/>
            <BrowserRouter>
                <Route exact path="/" component={Navbar}/>
                <Route exact path="/" component={Landing}/>
                <Route exact path="/" component={Footer}/>
                <Route exact path={'/home'} component={LandingPage} />
                <Switch>
                    <Route path="/entity" component={EntityType} />
                    <Route path="/ownerOperatorRegister" component={OwnerOp} />
                    <Route path="/fleetRegister" component={Fleet} />
                    <Route path='/setPassword' component={SetPassword} />
                    <Route path="/register" component={Register}/>
                    <Route path={FEDERAL_SIGNUP_LINK} component={SignUp}/>
                    <Route path={FMCSA_VERIFICATION_LINK} component={FMCSAVerification}/>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute path="/profile" component={Profile}/>
                    <PrivateRoute path="/dashboard" component={Dashboard}/>
                    <PrivateRoute path="/create-profile" component={ProfileForm}/>
                    <PrivateRoute path="/edit-profile" component={EditProfile}/>
                    <PrivateRoute path="/loads" component={Loads}/>
                    <Route exact path={'/'}><Redirect to='/dashboard'/></Route>
                </Switch>
            </BrowserRouter>
        </Fragment>
    );
};

export default App;
