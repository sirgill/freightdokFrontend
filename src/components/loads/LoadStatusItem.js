import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteLoad, getLoads, selectLoad, searchLoads, downloadDocuments } from "../../actions/load";
// import LoadPickup from './LoadPickup';
// import LoadDrop from './LoadDrop';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import EditIcon from "@material-ui/icons/Edit";
import LoadDetailModal from './LoadDetailModal';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -7,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);
const LoadItem = ({ load, search, selectLoad, deleteLoad, getLoads, searchLoads, loads, page, rowsPerPage, user, listBarType }) => {
  const {_id, brokerage, loadNumber, pickup, drop, status, proofDelivery, rateConfirmation, accessorials } = load;
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

  const [open,setOpen] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    let time = '';

    if(hours > 0 && hours <= 12){
      time = "" + hours;
    }else if (hours > 12){
      time = "" + (hours - 12);
    }else if (hours === 0){
      time = "12";
    }

    time += (minutes < 10 ) ? ":0" + minutes : ":" + minutes;
    time += (hours >= 12) ? " P.M." : " A.M.";

    return [d.getMonth()+1,d.getDate(),d.getFullYear()].join('/')+ ' ' + time;
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
        onClick={()=>{
          // setOpen(true);
          // selectLoad({});
        }}>
          
          {/* <TableCell align="center"> */}
            {/* <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton> */}
          {/* </TableCell> */}
          
          <TableCell align="center">{loadNumber}</TableCell>
          
          {/* Made this 0 thought it would be nice to see if there is a pickup and drop on the load at all times */}
          
          {/* {pickup.length <= 0 ? (
            <Fragment>
              <TableCell align="center">{pickupCityFirst}, {pickupStateFirst}</TableCell>
            </Fragment>
          ) : (
            <TableCell align="center">
              <StyledBadge color="primary" max={10} badgeContent={pickup.length}>
                {pickupCityFirst}, {pickupStateFirst}
              </StyledBadge>
            </TableCell>
          )} */}
          
          <TableCell align="center">
            {status || '-'}
            {/* <Moment format='MM/DD'>{pickDateFirst}</Moment> */}
          </TableCell>
          <TableCell align="center">
            { pickupCityFirst ? pickupCityFirst : '-' },
            { pickupStateFirst ? pickupStateFirst : '-' }
          </TableCell>
          <TableCell align="center">
            { dropCityFirst ? dropCityFirst : '-' },
            { dropStateFirst ? dropStateFirst : '-' }
          </TableCell>
          
          <TableCell align="center">
            { Array.isArray(rateConfirmation) && rateConfirmation.length > 0 && typeof rateConfirmation[0] !== 'string'  ? 
              <CheckCircleIcon style={{color: 'green'}} />
              : <CancelIcon style={{color: 'red'}} /> }
            {/* <Moment format='MM/DD'>{dropDateFirst}</Moment> */}
          </TableCell>
          <TableCell align="center">
            { Array.isArray(proofDelivery) && proofDelivery.length > 0 && typeof proofDelivery[0] !== 'string' ? 
              <CheckCircleIcon style={{color: 'green'}} /> 
              : <CancelIcon style={{color: 'red'}} /> }
          </TableCell>
          <TableCell align="center">
            { accessorials.length ? accessorials.join(', ') : '-' }
          </TableCell>

          {listBarType === 'history' && <TableCell>
            <IconButton>
              <EditIcon color="primary" onClick={() => handleEditLoad()}/>
            </IconButton>
          </TableCell>}

          {/* <TableCell>
            <IconButton>
              <EditIcon color="primary" onClick={() => handleEditLoad()}/>
            </IconButton>
            { user && user.role === 'afterhours' || <IconButton >
              <DeleteIcon  onClick={(e) => { handleDeleteLoad(_id, e);}} style={{ color: "rgb(220, 0, 78)" }} />
            </IconButton> }
          </TableCell> */}

          {/* <TableCell></TableCell> */}
        </TableRow> 
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              { Array.isArray(rateConfirmation) && rateConfirmation.length > 0 && typeof rateConfirmation[0] !== 'string' ?
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Rate Confirmation Documents
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      { rateConfirmation.map(({ date, name }, key) => ( <TableRow key={key}>
                        <TableCell>{date ? <Moment format="DD/MM/YYYY">{date}</Moment> : '--'}</TableCell>
                        <TableCell>
                          { name ? <FindInPageIcon onClick={() => downloadDocuments(name)} /> : 'Invalid Link' }
                        </TableCell>
                      </TableRow>)) }
                  </TableBody>
                </Table>
              </Box> : '' }
              { Array.isArray(proofDelivery) && proofDelivery.length > 0 && typeof proofDelivery[0] !== 'string' ?
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Proof of Delivery Documents
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      { proofDelivery.map(({ date, name }, key) => ( <TableRow key={key}>
                        <TableCell>{date ? <Moment format="DD/MM/YYYY">{date}</Moment> : '--'}</TableCell>
                        <TableCell>
                          { name ? <FindInPageIcon onClick={() => downloadDocuments(name)} /> : 'Invalid Link' }
                        </TableCell>
                      </TableRow>)) }
                  </TableBody>
                </Table>
              </Box> : '' }
            </Collapse>
          </TableCell>
        </TableRow>       
      </TableBody>
      <LoadDetailModal 
        listBarType={listBarType}
        modalEdit={modalEdit}
        open={open}
        load={load} 
        handleClose={()=>{
            setOpen(false);
            enableEdit(false);
            selectLoad();
        }}
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