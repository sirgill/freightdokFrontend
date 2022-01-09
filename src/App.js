import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Alert from "./components/layout/Alert";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./components/layout/ui/Theme";
import PrivateRoute from "./components/routing/PrivateRoute";
import ProfileForm from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";

import Loads from './components/loads/Loads';

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Profile from "./components/users/Profile";
import { SERVER_ADDRESS } from "./actions/load";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

axios.defaults.baseURL = SERVER_ADDRESS;

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Route exact path="/" component={Navbar} />
          <Route exact path="/" component={Landing} />
          <Route exact path="/" component={Footer} />
          <Switch>
            <Redirect exact from="/" to={{ pathname: '/login' }} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route exact path="/create-profile" component={ProfileForm} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/loads" component={Loads} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
