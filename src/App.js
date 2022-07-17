import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {Provider} from "react-redux";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Alert from "./components/layout/Alert";
import {ThemeProvider as MUI4ThemeProvider} from "@material-ui/core/styles";
import {themeNew} from "./components/layout/ui/Theme";
import PrivateRoute from "./components/routing/PrivateRoute";
import ProfileForm from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";

import Loads from "./components/loads/Loads";

import store from "./store";
import {loadUser} from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Profile from "./components/users/Profile";
import {SERVER_ADDRESS} from "./actions/load";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./components/layout/Notification";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import "./App.css";
import {getBaseUrl} from "./config";
import LandingPage from "./views/landingPage/LandingPage";

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
                    <Route path="/register" component={Register}/>
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
