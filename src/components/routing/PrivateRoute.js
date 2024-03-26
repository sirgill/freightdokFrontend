import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {LOGIN_LINK} from "../constants";

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  const token = localStorage.getItem('token') || null;
  return (
      <Route
          {...rest}
          render={props =>
              !!token ? <Component {...props} /> : <Redirect to={{pathname: LOGIN_LINK, state: {from: props.location}}} />
          }
      />
  )
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
