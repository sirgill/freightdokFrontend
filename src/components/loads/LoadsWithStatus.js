import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLoads, searchLoads } from "../../actions/load";
import Spinner from "../layout/Spinner";
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import LoadStatusItem from "./LoadStatusItem";

const LoadsWithStatus = ({ listBarType, getLoads, searchLoads, load: { loads, loading, loads_pagination, page, rowsPerPage, search } }) => {
  const { total } = loads_pagination;
  const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
  useEffect(() => {
    if (query)
      searchLoads(sPage, limit, query, listBarType);
    else 
      getLoads(page, rowsPerPage, listBarType);
  }, []);

  const handleChangePage = (event, newPage) => {
    if (query)
      searchLoads(newPage, limit, query, listBarType);
    else
      getLoads(newPage, rowsPerPage, listBarType);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = event.target.value;
    if (query)
      searchLoads(0, limit, query, listBarType);
    else
      getLoads(0, limit, listBarType);
  };

  return (
    <Fragment>
      {" "}
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>

            { !query && loads.length ? (
              loads.map((l) => <LoadStatusItem key={l._id} load={l} loads={loads} page={page} rowsPerPage={rowsPerPage} listBarType={listBarType} />)
            ) : query && sLoads.length ? (
              sLoads.map((l) => <LoadStatusItem key={l._id} load={l} loads={loads} page={sPage} rowsPerPage={limit} listBarType={listBarType} />)
            ) : ''}

            { (!query && !loads.length) || (query && !sLoads.length) ? <h4>No loads</h4> : '' }

            <TableFooter>
              <TableRow>
                { (!query && loads.length) ? <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  colSpan={3}
                  count={total}
                  rowsPerPage={+rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                /> : (query && sLoads.length) ? <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  colSpan={3}
                  count={sTotal}
                  rowsPerPage={+limit}
                  page={sPage}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />: '' }
              </TableRow>
            </TableFooter>
        </Fragment>
      )}
    </Fragment>
  );
};

LoadsWithStatus.propTypes = {
  getLoads: PropTypes.func.isRequired,
  load: PropTypes.object.isRequired,
  searchLoads: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  load: state.load,
  driver: state.driver
});

export default connect(mapStateToProps, { getLoads, searchLoads })(LoadsWithStatus);