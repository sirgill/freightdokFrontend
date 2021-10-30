import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';


const LoadPickup = ({ pickup: { shipperName, pickupAddress, pickupCity, pickupState, pickupZip,
pickupDate, pickupTime, pickupPo, pickupDeliverNumber, pickupReference }
}) => {
  return (
    <div>
    </div>
  )
}

LoadPickup.propTypes = {
  pickup: PropTypes.array.isRequired
};

export default LoadPickup;
