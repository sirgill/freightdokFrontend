import React from 'react';
import PropTypes from 'prop-types';


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
