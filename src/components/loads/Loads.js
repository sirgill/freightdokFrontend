import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { getLoads, searchLoads } from "../../actions/load";
import LoadItem from "./Loaditem";
import Spinner from "../layout/Spinner";
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

const Loads = ({ getLoads, searchLoads, load: { loads, loading, loads_pagination, page, rowsPerPage, search } }) => {
  const { total } = loads_pagination;
  const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
  const { user } = useSelector(state => state.auth);
  const [rawLoades, setRawLoads] = useState([]);
  
  useEffect(() => {
    if (query)
      searchLoads(sPage, limit, query);
    else 
      getLoads(page, rowsPerPage);
  }, []);

  useEffect(() => {
    if (user && user.role === 'load planner') {
      const filterredLoads = loads.filter(item => {
        if (!item.assignedTo) {
          return item;
        }
      });
      setRawLoads(filterredLoads);
    } else {
      setRawLoads(loads)
    }
  }, [loads])

  const handleChangePage = (event, newPage) => {
    console.log(newPage, query)
    if (query)
      searchLoads(newPage, limit, query);
    else
      getLoads(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = event.target.value;
    if (query)
      searchLoads(0, limit, query);
    else
      getLoads(0, limit);
  };

  return (
    <Fragment>
      {" "}
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>

            { !query && rawLoades.length ? (
              rawLoades.map((l) => <LoadItem key={l._id} load={l} loads={rawLoades} page={page} rowsPerPage={rowsPerPage} />)
            ) : query && sLoads.length ? (
              sLoads.map((l) => <LoadItem key={l._id} load={l} loads={rawLoades} page={sPage} rowsPerPage={limit} />)
            ) : ''}

            { (!query && !rawLoades.length) || (query && !sLoads.length) ? <h4>No loads</h4> : '' }

            <TableFooter>
              <TableRow>
                { (!query && rawLoades.length) ? <TablePagination
                  rowsPerPageOptions={[]}
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
                  rowsPerPageOptions={[]}
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
