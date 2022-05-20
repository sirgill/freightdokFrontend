import React from "react";
import {
    Box,
    Grid, Stack, Typography
} from "@mui/material";
import moment from 'moment'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Modal from "../ownerOperator/Modal";
import Details from "./PickupDetails";

const Typo = ({label = '', value = '', labelSx = {}}) => {
    return <Stack direction={'row'}>
        <Typography sx={{mr: 1, ...labelSx}}>{label}:</Typography>
        <Typography sx={labelSx}>{value}</Typography>
    </Stack>
}

const BasicLoadDetails = ({loadNumber = '', trip, weight}) => {
    return (
        <Box display={'flex'} justifyContent={'center'}>
            <Stack alignItems={'center'}>
                <Typo value={loadNumber} label={'Load Number'} labelSx={{fontSize: 32}}/>
                <Typo value={loadNumber} label={'Equipment'} labelSx={{fontSize: 24}}/>
                <Typo value={weight + ' lbs'} label={'Weight'} labelSx={{fontSize: 24}}/>
                <Typo value={trip + ' miles'} label={'Trip'} labelSx={{fontSize: 24}}/>
            </Stack>
        </Box>
    )
}

const LoadDetails = (props) => {
    const {location: {state: data = {}} = {}} = props,
        {
            loadNumber = '', distance: {miles = ''} = {}, weight: {pounds = ''} = {},
            origin: {name = '', stateCode, postalCode = '', county = '', pickupScheduleRequest} = {},
            destination: {name: destinationName = '', stateCode: destinationStateCode, postalCode: destinationPostal = '',
                county: destinationCounty = '', scheduleRequest: dropScheduleRequest = ''} = {},
            pickUpByDate = '',
            deliverBy = ''
        } = data;
    const config = {
        title: "",
    };

    return (
        <Modal config={config}>
            <Grid container spacing={2} sx={{p: 2}}>
                <Grid item xs={12}>
                    <Typography align='center' variant='h4'>CH Robinson</Typography>
                </Grid>
                <Grid item xs={12} textAlign={'center'}>
                    <BasicLoadDetails loadNumber={loadNumber} trip={miles} weight={pounds}/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent={'center'}>
                        <Grid xs={4} textAlign={'center'} className={'openBoardPickupDetails'}>
                            <Details
                                title={'Pickup'}
                                name={name}
                                location={county + ", " + stateCode + " " + postalCode}
                                type={'Pickup Date'}
                                date={moment(pickUpByDate).format('MM/DD/yyyy')}
                                appointment={pickupScheduleRequest === 'A' ? 'Yes' : 'No'}
                                avgLoadTime={'--'}
                            />
                        </Grid>
                        <Grid xs={4} textAlign={'center'}>
                            <ArrowForwardIcon sx={{fontSize: '8rem'}} />
                        </Grid>
                        <Grid xs={4} textAlign={'center'}>
                            <Details
                                title={'Delivery'}
                                name={destinationName}
                                location={destinationCounty + ", " + destinationStateCode + " " + destinationPostal}
                                type={'Delivery Date'}
                                date={moment(deliverBy).format('MM/DD/yyyy')}
                                appointment={dropScheduleRequest === 'A' ? 'Yes' : 'No'}
                                avgLoadTime={'--'}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default LoadDetails;
