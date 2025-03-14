import Modal from "../../components/Atoms/Modal";
import {Grid, Typography} from "@mui/material";
import Details from "./PickupDetails";
import moment from "moment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useCallback, useEffect } from "react";
import { BasicLoadDetails } from "./LoadDetails";
import { requestPost } from "../../utils/request";
import { getGoUrl } from "../../config";
import { CARRIER_EMAIL, MC_NUMBER } from "./constants";
import styled from "@mui/material/styles/styled";

const ArrowIcon = styled(ArrowForwardIcon)(({theme}) => ({
    fontSize: '8rem',
    [theme.breakpoints.down('sm')]: {
        transform: 'rotate(90deg)',
        fontSize: '5rem'
    }
}))

const LeftDetails = ({ state }) => {
    const { stops = [] } = state || {};
    // eslint-disable-next-line no-unused-vars
    const [_, { geo = {}, early_datetime, late_datetime, appointment_required }] = stops;
    const { city, state: stateCode } = geo || {};
    return <Details
        title={'Pickup'}
        // name={name}
        location={`${city}${stateCode ? ", " + stateCode : ''}`}
        type={'Pickup Date'}
        date={moment(early_datetime).format('MM/DD/yyyy')}
        appointment={appointment_required ? 'Yes' : 'No'}
        avgLoadTime={'--'}
        loadBy={`${moment(early_datetime).format('HH:mm:ss')} ${late_datetime ? "- " + moment(late_datetime).format('HH:mm:ss') : ''}`}
        loadByType='Ready By'
    />
}

const RightDetails = ({ state }) => {
    const { stops = [] } = state;
    // eslint-disable-next-line no-unused-vars
    const [{ geo = {}, early_datetime, late_datetime, appointment_required }] = stops || [{}];
    const { city, state: stateCode } = geo || {};
    return <Details
        title={'Delivery'}
        // name={destinationName}
        location={`${city}${stateCode ? ", " + stateCode : ''}`}
        type={'Delivery Date'}
        date={moment(early_datetime).format('MM/DD/yyyy')}
        appointment={appointment_required ? 'Yes' : 'No'}
        avgLoadTime={'--'}
        loadBy={`${moment(early_datetime).format('HH:mm:ss')} ${late_datetime ? "- " + moment(late_datetime).format('HH:mm:ss') : ''}`}
        loadByType='Deliver By'
    />
}

const NewTrulLoadDetails = (props) => {
    const { location: { state = {} } = {}, callDetail = true } = props;
    const { id: loadNumber, loaded_miles, weight, equipment, client: { compliance_link = '', client_name } = {} } = state
    // console.log(state)
    const config = {
        title: client_name,
        showClose: true,
        titleStyles: {
            fontSize: '2rem',
            p: 1
        },
        preventBackdropClick: true
    };

    const postDetailToNewTrul = useCallback(async () => {
        let body = {
            "event_type": "LOAD_VIEW_DETAILS",
            "event_data": {
                "load_id": loadNumber,
                "carrier_email": CARRIER_EMAIL,
                "mc_number": MC_NUMBER,
                "first_name": "Sunny",
                "last_name": "Freight",
                "phone_number": "3179654608"
            }
        }
        requestPost({ uri: '/newTrulShowLoadDetails', baseUrl: getGoUrl(), body })
    }, [loadNumber])

    useEffect(() => {
        callDetail && postDetailToNewTrul();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetailToNewTrul])

    return (
        <Modal config={config}>
            <Grid container gap={3} sx={{ p: 0 }}>
                <Grid item xs={12} textAlign={'center'}>
                    <BasicLoadDetails loadNumber={loadNumber} trip={loaded_miles} weight={weight}
                        equipment={equipment} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent={'center'}>
                        <Grid item sm={5} xs={12} textAlign={'center'} className={'openBoardPickupDetails'}>
                            <LeftDetails state={state} />
                        </Grid>
                        <Grid item sm={2} xs={12} textAlign={'center'}>
                            <ArrowIcon />
                        </Grid>
                        <Grid item sm={5} xs={12} textAlign={'center'}>
                            <RightDetails state={state} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} textAlign={'center'}>
                    {compliance_link &&
                        <Typography sx={{ textDecoration: 'underline' }} component='a' href={compliance_link}
                            target='_blank'>{compliance_link}</Typography>}
                </Grid>
            </Grid>
        </Modal>
    )
}

export default NewTrulLoadDetails