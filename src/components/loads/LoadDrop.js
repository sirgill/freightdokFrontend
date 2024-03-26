import React from 'react';
import PropTypes from 'prop-types';


const LoadDrop = ({ drop: { receiverName, dropAddress, dropCity, dropState, dropZip,
dropDate, dropTime, dropPo, dropDeliverNumber, dropRef }
}) => {
  return (
    <div>
    </div>
  )
}

LoadDrop.propTypes = {
  drop: PropTypes.array.isRequired
};

export default LoadDrop;
