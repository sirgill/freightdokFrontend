import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect, useSelector } from 'react-redux';
import { deleteLoad, getLoads, selectLoad, searchLoads } from "../../actions/load";
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Badge from '@material-ui/core/Badge';

import LoadDetailModal from './LoadDetailModal';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -7,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const LoadItem = ({ load, search, selectLoad, deleteLoad, getLoads, searchLoads, loads, page, rowsPerPage, user }) => {
  const { _id, brokerage, loadNumber, pickup, drop, status, proofDelivery, rateConfirmation, accessorials } = load;
  const [modalEdit, enableEdit] = useState(false);
  const pickupState = pickup.map((pickup) => pickup.pickupState);
  const pickupCity = pickup.map((pickup) => pickup.pickupCity);
  const pickupDate = pickup.map((pickup) => pickup.pickupDate);

  const dropState = drop.map((drop) => drop.dropState);
  const dropCity = drop.map((drop) => drop.dropCity);
  const dropDate = drop.map((drop) => drop.dropDate);

  const pickupStateFirst = pickupState[0];
  const pickupCityFirst = pickupCity[0];
  const pickDateFirst = pickupDate[0];

  const dropStateFirst = dropState[0];
  const dropCityFirst = dropCity[0];
  const dropDateFirst = dropDate[0];

  const [open, setOpen] = useState(false);
  const [assignedToLocal, setAssignedTo] = useState(null);

  const state = useSelector(state => state);

  useEffect(() => {
    if (state.driver && state.driver.drivers && state.driver.drivers.length) {
      state.driver.drivers.forEach((item) => {
        if (item.user && item.user._id === load.user) {
          setAssignedTo(item.user.name)
        }
      });
    }
  }, [state.driver.drivers])

  const formatDate = (date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    let time = '';

    if (hours > 0 && hours <= 12) {
      time = "" + hours;
    } else if (hours > 12) {
      time = "" + (hours - 12);
    } else if (hours === 0) {
      time = "12";
    }

    time += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    time += (hours >= 12) ? " P.M." : " A.M.";

    return [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') + ' ' + time;
  }

  const handleDeleteLoad = async (load_id, e) => {
    e.stopPropagation();
    console.log("LOAD IS:         ", load_id)
    await deleteLoad(load_id);
    const { query, page: sPage, limit } = search;
    if (!query)
      getLoads(page, rowsPerPage);
    else
      searchLoads(sPage, limit, query);

    setOpen(false)
  };

  const handleEditLoad = () => {
    setOpen(true);
    enableEdit(true);
    selectLoad({});
  };

  return (
    <>
      <TableBody>
        <TableRow
          hover={true}
          onClick={() => {
            setOpen(true);
            selectLoad({});
          }}>

          <TableCell align="center">{loadNumber}</TableCell>

          {pickup.length <= 0 ? (
            <Fragment>
              <TableCell align="center">{pickupCityFirst}, {pickupStateFirst}</TableCell>
            </Fragment>
          ) : (
            <TableCell align="center">
              {pickupCityFirst}, {pickupStateFirst}
              {/* <StyledBadge color="primary" max={10} badgeContent={pickup.length}>
                {pickupCityFirst}, {pickupStateFirst}
              </StyledBadge> */}
            </TableCell>
          )}

          <TableCell align="center">
            <Moment format='MM/DD'>{pickDateFirst}</Moment>
          </TableCell>

          <TableCell>
            {dropCityFirst}, {dropStateFirst}
          </TableCell>

          <TableCell align="center">
            <Moment format='MM/DD'>{dropDateFirst}</Moment>
          </TableCell>

          <TableCell align="center">{assignedToLocal ? assignedToLocal : ''}</TableCell>

          <TableCell align="center">{status}</TableCell>

          <TableCell>
            {brokerage}
            {/* <IconButton>
              <EditIcon color="primary" onClick={() => handleEditLoad()}/>
            </IconButton>
            { user && (user.role === 'afterhours' || user.role === 'driver') || <IconButton >
              <DeleteIcon  onClick={(e) => { handleDeleteLoad(_id, e);}} style={{ color: "rgb(220, 0, 78)" }} />
            </IconButton> } */}
          </TableCell>

          {/* <TableCell></TableCell> */}
        </TableRow>
      </TableBody>
      <LoadDetailModal
        modalEdit={modalEdit}
        open={open}
        load={load}
        handleClose={() => {
          setOpen(false);
          enableEdit(false);
          selectLoad();
        }}
        deleteLoad={(_id, e) => handleDeleteLoad(_id, e)}
      />
    </>
  );
};

LoadItem.propTypes = {
  load: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth: { user }, load: { search } }) => ({ user, search });

export default connect(
  mapStateToProps,
  { deleteLoad, getLoads, selectLoad, searchLoads }
)(LoadItem)