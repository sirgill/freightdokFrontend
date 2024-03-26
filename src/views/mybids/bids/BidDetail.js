import Modal from "../../../components/Atoms/Modal";
import {Button, Grid, IconButton, Stack, Typography} from "@mui/material";
import {v4 as uuidv4} from 'uuid';
import InputField from "../../../components/Atoms/form/InputField";
import AddIcon from "@mui/icons-material/Add";
import React, {Fragment, memo, useEffect, useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import prepareBidDataForNewTrul, {prepareBidDataForChRobinson} from "./constant";
import {newCounterOfferAction, newTrulFinalOfferAction, placeNewCounterOffer} from "../../../actions/bid.action";
import {CARRIER_EMAIL, MC_NUMBER, productionPayload} from "../../openBoard/constants";
import {notification} from "../../../actions/alert";
import {bookChRobinsonLoad} from "../../../actions/openBoard.action";
import useMutation from "../../../hooks/useMutation";
import {getUserDetail} from "../../../utils/utils";
import Alert from "../../../components/Atoms/Alert";

const CH_ROBINSON = 'c.h. robinson';

const AmountComponent = ({value, name, handleChange}) => {
    const [amount, setAmount] = useState(value)

    const onSubtract = () => {
        if (amount > 0)
            setAmount(amount - 1)
    }

    const onAdd = () => {
        setAmount(parseInt(amount) + 1)
    }
    const onChange = (e) => {
        const text = e.target.value;
        setAmount(text);
    };

    useEffect(() => {
        if (handleChange) {
            handleChange({name, value: amount})
        }
    }, [amount, name, handleChange]);

    return <Fragment>
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
    </Fragment>
}

const OFFER_STATUS_FINAL = ['final_offer_created', 'accepted']

const BidDetail = (props) => {
    const {location: {state = {}} = {}, history, onCloseUrl, onRefresh} = props,
        {loadNumber = '', vendorName = ''} = state;
    const [bidInput, setBidInput] = useState('0.00');
    const {mutation} = useMutation('/api/bid/deleteBidByLoadNumber/' + loadNumber, afterSubmit)
    const [data, setData] = useState({amount: 0}),
        offerStatus = state?.offerStatus || '',
        isFinalOffer = OFFER_STATUS_FINAL.some(a => a.equalsIgnoreCase(offerStatus)) || false,
        isCounterOffer = offerStatus.equalsIgnoreCase("COUNTER_OFFER_CREATED"),
        isChRobinson = vendorName.equalsIgnoreCase('c.h. robinson'),
        canProceedToBid = !!data.offerStatus,
        clientName = data.client_name,
        showDelete = isChRobinson && offerStatus.equalsIgnoreCase('notconsidered');


    useEffect(() => {
        if (vendorName.equalsIgnoreCase('new trul')) {
            const newTrulState = prepareBidDataForNewTrul(state);
            setBidInput(newTrulState.amount);
            setData(newTrulState);
        } else if (isChRobinson) {
            const chRobinsonState = prepareBidDataForChRobinson(state);
            setData(chRobinsonState);
            setBidInput(chRobinsonState.amount)
        }
    }, [state, vendorName])

    const onSubmit = () => {

    }

    const onChange = ({value}) => {
        setBidInput(value)
    }

    const afterUpdate = (data) => {
        if (data.error) {
            notification(data.message, 'error')
        } else {
            history.goBack()
        }
    }


    const placeNewBid = () => {
        if (vendorName.equalsIgnoreCase('new trul')) {
            const {counterOfferId} = data;
            const obj = {
                offerId: counterOfferId,
                external_id: uuidv4(),//data.external_id,
                offer_amount: bidInput,
                expired_at: data.expired_at,
                mcNumber: MC_NUMBER,
                carrierMail: CARRIER_EMAIL,
            }
            if (data.offerStatus.equalsIgnoreCase("COUNTER_OFFER_CREATED")) {
                placeNewCounterOffer(obj, afterUpdate);
            }
        }
    }

    function afterSubmit(success, data) {
        if (success) {
            afterUpdate({});
            notification('Bid success for Load number', loadNumber);
        } else {
            notification(data.message, 'error')
        }
    }

    const customMessage = () => {
        if (isChRobinson && !canProceedToBid) {
            return <Alert
                config={{
                    open: true, message: 'We are waiting for the response on this bid.', severity: 'info',
                }}
            />
        }
        return null;
    }

    const checkVisibility = () => {
        if (isChRobinson) {
            return false
        }
        return true;
    }

    const bidAction = (action = '') => {
        const {counterOfferId} = data;
        const payload = {
            offerId: counterOfferId,
            mcNumber: MC_NUMBER,
            carrierMail: CARRIER_EMAIL,
            status: action,
        }
        if (isFinalOffer) {
            if (vendorName.equalsIgnoreCase(CH_ROBINSON)) {
                if (action === 'reject') {
                    return mutation({}, 'delete');
                }
                const date = new Date().toDateString(),
                    time = new Date().toTimeString(),
                    {
                        type,
                        code,
                        description,
                        units,
                        currencyCode
                    } = state.loadDetail.availableLoadCosts[0] || {};
                const body = {
                    carrierCode: productionPayload.carrierCode,
                    loadNumber: Number(loadNumber),
                    emptyDateTime: new Date(date + " " + time).toISOString(),
                    availableLoadCosts: [{
                        type, code, description, units, currencyCode, sourceCostPerUnit: Number(bidInput)
                    }],
                    emptyLocation: {
                        "city": "Greenwood",
                        "state": "IN",
                        "country": "NA",
                        "zip": "46143"
                    },
                    rateConfirmation: {
                        email: getUserDetail().user.email,
                        name: getUserDetail().user.name
                    }
                }
                return bookChRobinsonLoad(loadNumber, body, afterSubmit);
            } else newTrulFinalOfferAction(payload)
                .then(res => {
                    if (res.data.status === 'error') {
                        notification(res.data.message, 'error')
                    }
                })
                .catch(err => console.log(err))
        } else newCounterOfferAction(payload)
            .then(res => {
                if (res.data.status === 'error') {
                    notification(res.data.message, 'error')
                } else if (res.data.status.equalsIgnoreCase('success')) {
                    if (onRefresh) onRefresh();
                    history.push(onCloseUrl);
                }
            })
            .catch(err => console.log(err));
    }

    return <Modal>
        <Grid sx={{px: 3}} justifyContent="center" display="flex">
            <form onSubmit={onSubmit} style={{textAlign: 'center'}} className={'form_bidding'}>
                <Typography sx={{fontSize: 32}}>
                    {clientName || vendorName || '--'}
                </Typography>
                <Typography sx={{fontSize: 32}}>
                    Load Number: {loadNumber}
                </Typography>
                {isFinalOffer && <Typography fontSize={18} sx={{my: 3}}>{`Final Offer: $${data.amount}`}</Typography>}
                {isCounterOffer && <Typography fontSize={18}>{`Offer: $${data.amount}`}</Typography>}
                <Stack gap={2} direction={'row'} justifyContent='center' my={2}>
                    <Button variant='contained' color="success" sx={{px: 5}}
                            onClick={bidAction.bind(this, 'accept')}
                            disabled={!canProceedToBid}
                    >
                        Accept
                    </Button>
                    <Button
                        variant='contained' color="error" sx={{px: 5}}
                        onClick={bidAction.bind(this, 'reject')}
                        disabled={!canProceedToBid}
                    >
                        {showDelete ? "Delete" : "Reject"}
                    </Button>
                </Stack>
                {customMessage()}
                {!isFinalOffer && checkVisibility() && <>
                    <Typography>OR</Typography>
                    <Stack direction={'row'} sx={{py: 2}} alignItems={'end'} gap={'10px'} justifyContent={'center'}>
                        <AmountComponent value={bidInput} handleChange={onChange}/>
                    </Stack>
                    <Button variant="contained" color="primary" sx={{px: 2, py: .5, fontSize: 14}}
                            onClick={placeNewBid}>
                        {isCounterOffer ? "Submit Counter" : 'Submit Bid'}
                    </Button>
                </>}
            </form>
        </Grid>
    </Modal>
}

export default memo(BidDetail, () => true)