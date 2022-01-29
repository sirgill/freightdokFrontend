import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loads from "../loads/Loads.js";
import Spinner from "../layout/Spinner";
import { TableFooter, TablePagination } from "@material-ui/core";
import {connect, useDispatch, useSelector} from "react-redux";
import {deleteLoad, getLoads, searchLoads, selectLoad} from "../../actions/load";
import { useStyles } from "../HelperCells.js";
import EnhancedTable from "../Atoms/table/Table";
import Moment from "react-moment";
import LoadDetailModal from "../loads/LoadDetailModal";

const Loadlistbar = ({
  getLoads,
  searchLoads,
  load: { loads, loads_pagination, page, rowsPerPage, search },
  resetSearchField,
}) => {
  const dispatch = useDispatch(),
  classes = useStyles();
  const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({open: false, data: {}});
  const { total } = loads_pagination;
  const [rawLoades, setRawLoads] = useState([]);
  const { auth: {user={}} = {}, driver: {drivers = []} = {} } = useSelector((state) => state);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    resetSearchField();
    return () => {
      resetSearchField();
    };
  }, []);

  useEffect(() => {
    if (user && user.role === "load planner") {
      const filterredLoads = loads.filter((driver) => {
        if (!driver.assignedTo) {
          return driver;
        }
      });
      setRawLoads(filterredLoads);
    } else {
      setRawLoads(loads);
    }
  }, [loads]);

  const handleChangePage = (event, newPage) => {
    console.log(newPage, query);
    if (query) searchLoads(newPage, limit, query);
    else getLoads(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = event.target.value;
    if (query) searchLoads(0, limit, query);
    else getLoads(0, limit);
  };

  const tableConfig = {
    onRowClick: (row) => setOpen({open: true, data: row}) ,
    rowCellPadding: 'inherit',
    count: total,
    page: page,
    limit: rowsPerPage,
    onPageChange: (e, newPage)=> getLoads(newPage - 1, rowsPerPage),
    columns: [
      {
        id: 'loadNumber',
        label: 'Load Number'
      },
      {
        id: 'pickup',
        label: 'PickUp City/State',
        renderer: ({row: {pickup = []} = {}}) => {
          const [{pickupCity='', pickupState=''}] = pickup;
          return `${pickupCity}, ${pickupState}`;
        }
      },
      {
        id: 'pickupDate',
        label: 'Pickup Date',
        renderer: ({row: {pickup = []} = {}}) => {
          const [{pickupDate=''}] = pickup;
          return <Moment format='MM/DD'>{pickupDate}</Moment>
        }
      },
      {
        id: 'dropCity',
        label: 'Drop City/State',
        renderer: ({row: {drop = []} = {}}) => {
          const [{dropCity='', dropState=''}] = drop;
          return `${dropCity}, ${dropState}`;
        }
      },
      {
        id: 'dropDate',
        label: 'Drop Date',
        renderer: ({row: {drop = []} = {}}) => {
          const [{dropDate=''}] = drop;
          return <Moment format='MM/DD'>{dropDate}</Moment>
        }
      },
      {
        id: 'assignedTo',
        label: 'Assigned To',
        renderer: ({row}) => {
          const {user} = row || {},
              {user: {name = ''} = {}} = drivers.find(driver => driver.user && driver.user._id === user) || {};
          return name;
        }
      },
      {
        id: 'brokerage',
        label: 'Customer',
        renderer: ({row: {brokerage = ''} = {}}) => {
          return brokerage;
        }
      },
    ]
  }

  return (
    <div className={classes.table}>
      <EnhancedTable config={tableConfig} data={rawLoades} loading={loading} />
      {open.open && <LoadDetailModal
          modalEdit={false}
          open={open.open}
          load={open.data}
          handleClose={() => {
            setOpen({open: false, data: {}});
            dispatch(selectLoad());
          }}
          deleteLoad={(_id) => dispatch(deleteLoad(_id))}
      />}
      {/*{loading ? (*/}
      {/*  <Spinner />*/}
      {/*) : (*/}
      {/*  <Fragment>*/}
      {/*    <TableContainer component={Paper} className={classes.TableContainer}>*/}
      {/*      <Table borderBottom="none" aria-label="caption table">*/}
      {/*        <TableHead className={classes.TableContainer}>*/}
      {/*          <TableRow>*/}
      {/*            <TableCell align="center">Load Number</TableCell>*/}
      {/*            <TableCell align="center">PickUp</TableCell>*/}
      {/*            <TableCell align="center">Pickup Date</TableCell>*/}
      {/*            <TableCell align="center">Drop</TableCell>*/}
      {/*            <TableCell align="center">Drop Date</TableCell>*/}
      {/*            <TableCell align="center">Assigned To</TableCell>*/}
      {/*            <TableCell align="center">Load Status</TableCell>*/}
      {/*            <TableCell align="center">Brokerage</TableCell>*/}
      {/*          </TableRow>*/}
      {/*        </TableHead>*/}
      {/*        <Loads classes={classes} rawLoades={rawLoades} />*/}
      {/*      </Table>*/}
      {/*    </TableContainer>*/}
      {/*    <TableFooter style={{ display: "flex" }}>*/}
      {/*      {!query && rawLoades.length ? (*/}
      {/*        <TablePagination*/}
      {/*          className={classes.footerLoadListBar}*/}
      {/*          rowsPerPageOptions={[]}*/}
      {/*          colSpan={3}*/}
      {/*          count={total}*/}
      {/*          rowsPerPage={+rowsPerPage}*/}
      {/*          page={page}*/}
      {/*          SelectProps={{*/}
      {/*            inputProps: { "aria-label": "rows per page" },*/}
      {/*            native: true,*/}
      {/*          }}*/}
      {/*          onChangePage={handleChangePage}*/}
      {/*          onChangeRowsPerPage={handleChangeRowsPerPage}*/}
      {/*        />*/}
      {/*      ) : query && sLoads.length ? (*/}
      {/*        <TablePagination*/}
      {/*          rowsPerPageOptions={[]}*/}
      {/*          colSpan={3}*/}
      {/*          count={sTotal}*/}
      {/*          rowsPerPage={+limit}*/}
      {/*          page={sPage}*/}
      {/*          SelectProps={{*/}
      {/*            inputProps: { "aria-label": "rows per page" },*/}
      {/*            native: true,*/}
      {/*          }}*/}
      {/*          onChangePage={handleChangePage}*/}
      {/*          onChangeRowsPerPage={handleChangeRowsPerPage}*/}
      {/*        />*/}
      {/*      ) : (*/}
      {/*        ""*/}
      {/*      )}*/}
      {/*    </TableFooter>*/}
      {/*  </Fragment>*/}
      {/*)}*/}
    </div>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  driver: state.driver,
});

export default connect(mapStateToProps, { getLoads, searchLoads })(Loadlistbar);
