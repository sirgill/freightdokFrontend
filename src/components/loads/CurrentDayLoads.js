import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CurrentDayLoadItem from "./CurrentDayLoadItem";
import Spinner from "../layout/Spinner";

const CurrentDayLoads = ({ load: { loads, loading, search } }) => {
  const { query, loads: sLoads } = search;
  
  return (
    <Fragment>
      {" "}
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
            {!query && loads.length ? (
              loads.map((load) => <CurrentDayLoadItem key={load._id} load={load} load_id={load._id} />)
            ) : query && sLoads.length ? (
              sLoads.map((load) => <CurrentDayLoadItem key={load._id} load={load} load_id={load._id} /> ) 
            ) : '' }
            { (!query && !loads.length) || (query && !sLoads.length) ? <h4>No load Today</h4> : '' }
        </Fragment>
      )}
    </Fragment>
  );
};

CurrentDayLoads.propTypes = {
  load: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  load: state.load,
});

export default connect(mapStateToProps, {})(CurrentDayLoads);
