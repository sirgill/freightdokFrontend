import {Backdrop, Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography} from '@mui/material'
import {Edit} from '@mui/icons-material';
import React from 'react'
import {useHistory} from 'react-router-dom';
import {FACILITIES_LINK} from "../client/routes";
import Spinner from "../../components/layout/Spinner";
import useEnhancedFetch from "../../hooks/useEnhancedFetch";
import {PRIMARY_BLUE} from "../layout/ui/Theme";


const InfoComponent = ({ data = {}, hasPermission }) => {
    const { _id = '', address = '', averageLoadTime = '', city = '', zip, state, parking, appointment, restrooms, serviceHours } = data;
    const history = useHistory();
    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container display='flex'>
                    <Grid item xs={5}>
                        <div style={{fontSize: '20px', fontWeight: 600, textAlign: 'center'}}>INFO</div>
                        <Box sx={{display: 'flex', flexDirection: 'column', '& .infoValues': {pt: 2}}}>
                            <div className={'infoValues'}>
                                <span>Address: </span><span>{address}</span>
                            </div>
                            <div className={'infoValues'}><span>City: </span><span>{city}</span></div>
                            <div className={'infoValues'}><span>State: </span><span>{state}</span></div>
                            <div className={'infoValues'}><span>Zip: </span><span>{zip}</span></div>
                            <div className={'infoValues'}>
                                <span>Parking: </span><span>{parking ? 'Yes' : 'No'}</span></div>
                            <div className={'infoValues'}><span>Appointment: </span><span>{appointment}</span>
                            </div>
                            <div className={'infoValues'}><span>FCFS: </span><span>{''}</span></div>
                            <div className={'infoValues'}>
                                <span>Hours of Service: </span><span>{serviceHours}</span></div>
                            <div className={'infoValues'}>
                                <span>Restrooms: </span><span>{restrooms ? 'Yes' : 'No'}</span></div>
                        </Box>
                    </Grid>
                    <Grid xs={2} item>
                        <div style={{fontSize: '20px', fontWeight: 600, textAlign: 'center', marginTop: '50%'}}>Average
                            Load Time
                        </div>
                        <Typography style={{textAlign: 'center'}} variant='h5'>{averageLoadTime}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <div style={{fontSize: '20px', fontWeight: 600, textAlign: 'center'}}>Recent Loading Times</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{marginTop: '1rem'}}>
                <IconButton disabled={!hasPermission} onClick={() => history.push(FACILITIES_LINK + '/edit/' + _id)}>
                    <Edit sx={{color: PRIMARY_BLUE}} />
                </IconButton>
            </Grid>
        </Grid>
    )
}


function Preview(props) {
    const {history, match: {params: {id = ''}}, closeUrl, canEdit} = props;
    const {data: _data = {}, loading} = useEnhancedFetch('/api/warehouse/' + id, {showPagination: false}),
        {data = {}} = _data || {};

    const closeModal = () => {
        history.push(closeUrl);
    }

    if(loading){
        return <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
            open={loading}
        >
            <Spinner sx={{color: 'inherit'}} />
        </Backdrop>
    }

    return (
        <div>
            <Dialog maxWidth='xl' onClose={closeModal} aria-labelledby="customized-dialog-title" open={true}>
                <DialogContent dividers>
                    <DialogTitle sx={{textAlign: 'center'}} id="customized-dialog-title" onClose={() => null}>
                        <Typography sx={{fontWeight: 600}} variant='h5'>{data?.name || 'Warehouse'}</Typography>
                    </DialogTitle>
                    <InfoComponent data={data} hasPermission={canEdit}/>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Preview
