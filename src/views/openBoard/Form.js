import Modal from "../ownerOperator/Modal";
import moment from "moment";
import {useHistory} from 'react-router-dom';
import InputField from "../../components/Atoms/form/InputField";
import React, {useState} from "react";
import {Button, Grid, Typography, Stack, IconButton} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {v4 as uuidv4} from 'uuid';
import RemoveIcon from '@mui/icons-material/Remove';
import {placeNewTrulBid, bookNow, newTrulFinalOffer, placeNewTrulCounterOffer} from "../../actions/openBoard.action";
import {NEWTRUL, productionPayload} from "./constants";

/*
* {
    "external_id": "90ca7829-caf7-4f5f-9230-cddc13d7d965167640",
    "offer_amount": 1000,
    "expired_at": "2022-02-10T21:01:01+00:00",
    "terms_condition": true,
    "driver_name": "Driver Name",
    "driver_phone_number": "(123) 456-6789",
    "truck_number": "FVS200937",
    "trailer_number": "EA5318",
    "tracking_url": "https://www.google.com/"
}
* */
const Form = (props) => {

    const {
            location: {state: row = {}} = {},
            match: {params: {loadNumber: loadNum, counterOffer = false, finalOffer = false}} = {}
        } = props,
        history = useHistory(),
        {loadNumber = '', company, vendor, price} = row;
    let defaultCost = 0;
    const config = {
        showClose: true
    };
    if (row.hasOwnProperty("availableLoadCosts")) {
        const {availableLoadCosts = []} = row || {};
        const [item] = availableLoadCosts || [];
        if (item) {
            defaultCost = item.sourceCostPerUnit || 0
        }
    }
    const [amount, setAmount] = useState(price || defaultCost);
    const onChange = (e) => {
        const text = e.target.value;
        setAmount(text);
    };

    const afterSubmit = (success, data) => {
        if (data?.success || data.status === 'success') {
            history.goBack();
        }
    }

    const onSubmit = (e) => {
        //submit bidding
        e.preventDefault();
        if (vendor === NEWTRUL) {
            let payload = {
                "external_id": uuidv4(),
                "offer_amount": amount,
                "expired_at": moment(new Date(), "YYYY-MM-DDTHH:mm").add(1, 'day').utc().format(),
                "terms_condition": true,
                "driver_name": "Driver Name",
                "driver_phone_number": "(123) 456-6789",
                "truck_number": "FVS200937",
                "trailer_number": "EA5318",
                "tracking_url": "https://www.google.com/",
                loadId: row.id,
                vendorName: 'New Trul',
                loadDetail: row
            }
            if (counterOffer) {
                payload = {
                    external_id: row.external_id,
                    offer_amount: row.bidAmount,
                    expired_at: moment(new Date(), "YYYY-MM-DDTHH:mm").utc().format()
                }
                return placeNewTrulCounterOffer(payload, afterSubmit);
            }
            if (finalOffer) {
                payload = {
                    loadId: loadNum,
                    offerStatus: 'accept'
                }
                return newTrulFinalOffer(payload, afterSubmit)
            }
            placeNewTrulBid(payload, loadNum, afterSubmit)
            return;
        }
        Object.assign(row, {
            defaultEmail: "vy4693@gmail.com",
            env: "dev",
            bidAmount: amount,
        });
        const body = {
            "carrierCode": productionPayload.carrierCode,
            "offerPrice": amount,
            "offerNote": '',
            "currencyCode": "USD",
        }
        bookNow(loadNumber, body, afterSubmit);
    };

    const onSubtract = () => {
        if (amount > 0)
            setAmount(amount - 1)
    }

    const onAdd = () => {
        setAmount(parseInt(amount) + 1)
    }

    return (
        <Modal config={config}>
            <Grid sx={{px: 3}} justifyContent="center" display="flex">
                <form onSubmit={onSubmit} style={{textAlign: 'center'}} className={'form_bidding'}>
                    <Typography sx={{fontSize: 32}}>
                        {company}
                    </Typography>
                    <Typography sx={{fontSize: 32}}>
                        Load Number: {loadNumber}
                    </Typography>
                    <Stack direction={'row'} sx={{py: 5}} alignItems={'end'} gap={'10px'} justifyContent={'center'}>
                        <IconButton onClick={onSubtract} disabled={amount <= 0}>
                            <RemoveIcon/>
                        </IconButton>
                        <div className='dollarInput'>
                            <InputField
                                name="bidAmount"
                                label="Amount ($)"
                                onChange={onChange}
                                type="number"
                                value={amount}
                                className={''}
                            />
                        </div>
                        <IconButton onClick={onAdd}>
                            <AddIcon/>
                        </IconButton>
                    </Stack>
                    <Button variant="contained" color="success" onClick={onSubmit} sx={{px: 3, py: 1, fontSize: 16}}>
                        Submit Bid
                    </Button>
                </form>
            </Grid>
        </Modal>
    );
};

export default Form;
