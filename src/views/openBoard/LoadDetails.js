import React from "react";
import {
    Box,
    Grid, Stack, Typography
} from "@mui/material";
import moment from 'moment'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Modal from "../ownerOperator/Modal";
import Details from "./PickupDetails";
import {getParsedLoadEquipment} from "./constants";

const Typo = ({label = '', value = '', labelSx = {}}) => {
    return <Stack direction={'row'}>
        <Typography sx={{mr: 1, ...labelSx}}>{label}:</Typography>
        <Typography sx={labelSx}>{value}</Typography>
    </Stack>
}

const formatTimeZone = (timeDate) => {
    const formattedTime = timeDate.substring(timeDate.lastIndexOf('-'), timeDate.length)
    const [hours, minutes] = formattedTime.split(':');
    return { hours, minutes }
}

const BasicLoadDetails = ({loadNumber = '', trip, weight, equipment = ''}) => {
    return (
        <Box display={'flex'} justifyContent={'center'}>
            <Stack alignItems={'center'}>
                <Typo value={loadNumber} label={'Load Number'} labelSx={{fontSize: 32}}/>
                <Typo value={equipment} label={'Equipment'} labelSx={{fontSize: 24}}/>
                <Typo value={weight + ' lbs'} label={'Weight'} labelSx={{fontSize: 24}}/>
                <Typo value={trip + ' miles'} label={'Trip'} labelSx={{fontSize: 24}}/>
            </Stack>
        </Box>
    )
}

const LoadDetails = (props) => {
    const {location: {state: data = {}} = {}} = props,
        {modesString = '', standard = ''} = getParsedLoadEquipment(data),
        equipment = modesString + ' ' + standard,
        {
            loadNumber = '', distance: {miles = ''} = {}, weight: {pounds = ''} = {},
            origin: {name = '', stateCode, postalCode = '', city = '', pickupScheduleRequest} = {},
            destination: {
                name: destinationName = '', stateCode: destinationStateCode, postalCode: destinationPostal = '',
                city: destinationCity = '', scheduleRequest: dropScheduleRequest = ''
            } = {},
            pickUpByDate = '',
            deliverBy = '',
            calculatedPickUpByDateTime = '',
            calculatedDeliverByDateTime = '',
            stops = []
        } = data;
    const timeZonePickup = moment(calculatedPickUpByDateTime)._tzm
    const timeZoneDeliveryBy = moment(calculatedDeliverByDateTime)._tzm
    const originDetails = stops[0] || {},
        {calculatedArriveByEndDateTime, calculatedArriveByStartDateTime} = originDetails,
        {hours, minutes} = formatTimeZone(calculatedArriveByStartDateTime),
        originReadyByRange = `${moment(calculatedArriveByStartDateTime).subtract({hours, minutes}).format("HH:mm:ss")} - ${moment(calculatedArriveByEndDateTime).subtract({minutes, hours}).format("HH:mm:ss")}`;
    console.log(hours, minutes,moment(calculatedArriveByStartDateTime).subtract({hours, minutes}))
    const destinationDetails = stops[1] || {},
        {calculatedArriveByEndDateTime: destEndDateTime, calculatedArriveByStartDateTime: destStartDateTime} = destinationDetails,
        deliverByRange = `${moment(destStartDateTime).add({minutes: timeZoneDeliveryBy}).format("HH:mm:ss")} - ${moment(destEndDateTime).add({minutes: timeZoneDeliveryBy}).format("HH:mm:ss")}`;
    const config = {
        title: "",
    };
    console.log('stops', stops)
    return (
        <Modal config={config}>
            <Grid container spacing={2} sx={{p: 2}}>
                <Grid item xs={12}>
                    <Typography align='center' variant='h4'>CH Robinson</Typography>
                </Grid>
                <Grid item xs={12} textAlign={'center'}>
                    <BasicLoadDetails loadNumber={loadNumber} trip={miles} weight={pounds} equipment={equipment}/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent={'center'}>
                        <Grid xs={4} textAlign={'center'} className={'openBoardPickupDetails'}>
                            <Details
                                title={'Pickup'}
                                name={name}
                                location={`${city}${stateCode ? ", " + stateCode : ''} ${postalCode}`}
                                type={'Pickup Date'}
                                date={moment(pickUpByDate).format('MM/DD/yyyy')}
                                appointment={pickupScheduleRequest === 'A' ? 'Yes' : 'No'}
                                avgLoadTime={'--'}
                                loadBy={originReadyByRange}
                                loadByType='Ready By'
                            />
                        </Grid>
                        <Grid xs={4} textAlign={'center'}>
                            <ArrowForwardIcon sx={{fontSize: '8rem'}}/>
                        </Grid>
                        <Grid xs={4} textAlign={'center'}>
                            <Details
                                title={'Delivery'}
                                name={destinationName}
                                location={`${destinationCity}${destinationStateCode ? ", " + destinationStateCode : ''} ${destinationPostal}`}
                                type={'Delivery Date'}
                                date={moment(deliverBy).format('MM/DD/yyyy')}
                                appointment={dropScheduleRequest === 'A' ? 'Yes' : 'No'}
                                avgLoadTime={'--'}
                                loadBy={deliverByRange}
                                loadByType='Deliver By'
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default LoadDetails;
