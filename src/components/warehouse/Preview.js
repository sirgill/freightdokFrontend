import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { Edit } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWarehouseById } from '../../actions/warehouse';
import {FACILITIES_LINK} from "../client/routes";

const useStyles = makeStyles((theme) => ({
    formTitle: {
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: 700
    },
    editIcon: {
        color: '#1891FC',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    form: {
        padding: theme.spacing(5)
    },
    infoContainer: {
        minWidth: ''
    },
    loadTimeContainer: {
    },
    infoComponent: {
        display: 'flex',
    },
    infoValues: {
        width: '100%',
        paddingTop: '1rem'
    }
}));

const InfoComponent = ({ data = {}, hasPermission }) => {
    const { _id = '', address = '', averageLoadTime = '', city = '', zip, state, parking, appointment, restrooms, serviceHours } = data;
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container className={classes.infoComponent} display='flex'>
                    <Grid item xs={5} className={classes.infoContainer}>
                        <div style={{ fontSize: '20px', fontWeight: 600, textAlign: 'center' }}>INFO</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className={classes.infoValues}>
                                <span>Address: </span><span>{address}</span>
                            </div>
                            <div className={classes.infoValues}><span>City: </span><span>{city}</span></div>
                            <div className={classes.infoValues}><span>State: </span><span>{state}</span></div>
                            <div className={classes.infoValues}><span>Zip: </span><span>{zip}</span></div>
                            <div className={classes.infoValues}><span>Parking: </span><span>{parking ? 'Yes' : 'No'}</span></div>
                            <div className={classes.infoValues}><span>Appointment: </span><span>{appointment}</span></div>
                            <div className={classes.infoValues}><span>FCFS: </span><span>{''}</span></div>
                            <div className={classes.infoValues}><span>Hours of Service: </span><span>{serviceHours}</span></div>
                            <div className={classes.infoValues}><span>Restrooms: </span><span>{restrooms ? 'Yes' : 'No'}</span></div>
                        </div>
                    </Grid>
                    <Grid xs={2} item className={classes.loadTimeContainer}>
                        <div style={{ fontSize: '20px', fontWeight: 600, textAlign: 'center', marginTop: '50%' }}>Average Load Time</div>
                        <Typography style={{ textAlign: 'center' }} variant='h5'>{averageLoadTime}</Typography>
                    </Grid>
                    <Grid item xs={5} className={classes.infoContainer}>
                        <div style={{ fontSize: '20px', fontWeight: 600, textAlign: 'center' }}>Recent Loading Times</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '3rem' }}>
                <Link to={FACILITIES_LINK + '/edit/' + _id}>
                    <IconButton disabled={!hasPermission}>
                        <Edit className={classes.editIcon} />
                    </IconButton></Link>
            </Grid>
        </Grid>
    )
}


function Preview(props) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const { history, match: { params: { id = '' } }, closeUrl } = props;
    const { warehouse: { warehouseById: { data = {} } = {} } = {}, auth: { user: { role = '' } = {} } = {} } = useSelector(store => store) || {};
    const hasPermission = role === 'admin' || role === 'dispatch' || role === 'support';

    const closeModal = () => {
        history.push(closeUrl);
    }

    useEffect(() => {
        dispatch(getWarehouseById(id))
    }, [])

    return (
        <div>
            <Dialog maxWidth='xl' onClose={closeModal} aria-labelledby="customized-dialog-title" open={true}>
                <DialogContent dividers>
                    <DialogTitle className={classes.formTitle} id="customized-dialog-title" onClose={() => null}>
                        <Typography sx={{ fontWeight: 600 }}>{data.name || 'Warehouse'}</Typography>
                    </DialogTitle>
                    <InfoComponent data={data} hasPermission={hasPermission} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Preview
