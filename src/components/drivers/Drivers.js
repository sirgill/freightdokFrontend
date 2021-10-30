import React, { useEffect } from "react";
// redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getDrivers } from "../../actions/driver";
//components
import Spinner from "../layout/Spinner";
import DriverItem from "./Driveritem";

const Drivers = ({ getDrivers, driver: { drivers, loading } }) => {
  useEffect(() => {
    getDrivers();
  }, []);
  return (
    <>
      {" "}
      {loading ? (
        <Spinner />
      ) : (
        <>{drivers.length > 0 ? drivers.map((driver) => <DriverItem key={driver._id} driver={driver} />) : <h4>No Drivers</h4>}</>
      )}
    </>
  );
};

Drivers.propTypes = {
  getDrivers: PropTypes.func.isRequired,
  driver: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  driver: state.driver,
});

export default connect(mapStateToProps, { getDrivers })(Drivers);
