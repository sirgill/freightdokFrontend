import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';

const AppAlert = ({ alerts }) => {
  return <div 
  className="alert-container" 
  style={{
    position: 'absolute',
    zIndex: '9999',
    left: '50%',
    transform: 'translate(-50%, 10px)'
  }}>
  { alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <Alert 
    style={{margin: '10px'}}
    key={alert.id}
    variant="outlined" 
    severity={alert.alertType} 
    >
      {alert.msg}
    </Alert>)) }
  </div>
}
AppAlert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(AppAlert);
