import Modal from "../ownerOperator/Modal";
import {Grid, Typography} from "@mui/material";
import Details from "./PickupDetails";
import moment from "moment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, {useCallback, useEffect} from "react";
import {BasicLoadDetails} from "./LoadDetails";
import {requestPost} from "../../utils/request";
import {getGoUrl} from "../../config";
import {MC_NUMBER} from "./constants";

const LeftDetails = ({state}) => {
    const {stops = []} = state;
    const [{geo = {}, zipcode = '', early_datetime}] = stops;
    const {city, state: stateCode} = geo || {};
    return <Details
        title={'Pickup'}
        // name={name}
        location={`${city}${stateCode ? ", " + stateCode : ''} ${zipcode ? zipcode : '--'}`}
        type={'Pickup Date'}
        date={moment(early_datetime).format('MM/DD/yyyy')}
        appointment={'--'}
        avgLoadTime={'--'}
        loadBy={'--'}
        loadByType='Ready By'
    />
}

const RightDetails = ({state}) => {
    const {stops = []} = state;
    // eslint-disable-next-line no-unused-vars
    const [_, {geo = {}, zipcode = '', early_datetime}] = stops;
    const {city, state: stateCode} = geo || {};
    return <Details
        title={'Delivery'}
        // name={destinationName}
        location={`${city}${stateCode ? ", " + stateCode : ''} ${zipcode ? zipcode : '--'}`}
        type={'Delivery Date'}
        date={moment(early_datetime).format('MM/DD/yyyy')}
        appointment={'--'}
        avgLoadTime={'--'}
        loadBy={'--'}
        loadByType='Deliver By'
    />
}

const NewTrulLoadDetails = (props) => {
    const {location: {state = {}} = {}} = props;
    const {id: loadNumber, loaded_miles, weight, equipment} = state
    console.log(state)
    const config = {
        title: "",
    };

    const postDetailToNewTrul = useCallback(async () => {
        let body = {
            "event_type": "LOAD_VIEW_DETAILS",
            "event_data": {
                "load_id": loadNumber,
                "carrier_email": "sunnyfr_qa_carrier@yopmail.com",
                "mc_number": MC_NUMBER,
                "first_name": "Sunny",
                "last_name": "Logistics",
                "phone_number": "8975462574"
            }
        }
        requestPost({uri: '/newTrulShowLoadDetails', baseUrl: getGoUrl(), body})
    }, [loadNumber])

    useEffect(() => {
        postDetailToNewTrul();
    }, [postDetailToNewTrul])

    return (
        <Modal config={config}>
            <Grid container spacing={2} sx={{p: 2}}>
                <Grid item xs={12}>
                    <Typography align='center' variant='h4'>New Trul</Typography>
                </Grid>
                <Grid item xs={12} textAlign={'center'}>
                    <BasicLoadDetails loadNumber={loadNumber} trip={loaded_miles} weight={weight} equipment={equipment}/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent={'center'}>
                        <Grid xs={4} textAlign={'center'} className={'openBoardPickupDetails'}>
                            <LeftDetails state={state}/>
                        </Grid>
                        <Grid xs={4} textAlign={'center'}>
                            <ArrowForwardIcon sx={{fontSize: '8rem'}}/>
                        </Grid>
                        <Grid xs={4} textAlign={'center'}>
                            <RightDetails state={state}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    )
}

export default NewTrulLoadDetails