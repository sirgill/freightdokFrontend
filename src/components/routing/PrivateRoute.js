import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  const token = localStorage.getItem('token') || null;
  console.log(token, isAuthenticated)
  return (
      <Route
          {...rest}
          render={props =>
              !!token ? <Component {...props} /> : <Redirect to={{pathname: "/login", state: {from: props.location}}} />
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
