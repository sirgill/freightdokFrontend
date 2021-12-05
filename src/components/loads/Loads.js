import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { getLoads, searchLoads } from "../../actions/load";
import LoadItem from "./Loaditem";
import Spinner from "../layout/Spinner";
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

const Loads = ({ rawLoades, getLoads, searchLoads, load: { loads, loading, loads_pagination, page, rowsPerPage, search } }) => {
  const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (query)
      searchLoads(sPage, limit, query);
    else
      getLoads(page, rowsPerPage);
  }, []);


  return (
    <Fragment>
      {" "}
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>

          {!query && rawLoades.length ? (
            rawLoades.map((l) => <LoadItem key={l._id} load={l} loads={rawLoades} page={page} rowsPerPage={rowsPerPage} />)
          ) : query && sLoads.length ? (
            sLoads.map((l) => <LoadItem key={l._id} load={l} loads={rawLoades} page={sPage} rowsPerPage={limit} />)
          ) : ''}

          {(!query && !rawLoades.length) || (query && !sLoads.length) ? <h4>No loads</h4> : ''}


        </Fragment>
      )}
    </Fragment>
  );
};

Loads.propTypes = {
  getLoads: PropTypes.func.isRequired,
  load: PropTypes.object.isRequired,
  searchLoads: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  load: state.load,
  driver: state.driver
});

export default connect(mapStateToProps, { getLoads, searchLoads })(Loads);
