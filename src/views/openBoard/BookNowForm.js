import Modal from "../../components/Atoms/Modal";
import {Button, Grid, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {bookChRobinsonLoad, bidChRobinsonLoad, saveCHLoadToDb} from "../../actions/openBoard.action";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {notification} from "../../actions/alert";
import {getUserDetail, triggerCustomEvent} from "../../utils/utils";
import moment from "moment";
import useFetch from "../../hooks/useFetch";
import {GET_SECRETS_MANAGER} from "../../config/requestEndpoints";

const CustomGrid = ({label, children}) => {
    return <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item xs={5}>
            <Typography sx={{fontSize: 22, textAlign: 'left'}}>
                {label}
            </Typography>
        </Grid>
        <Grid item xs={7}>{children}</Grid>
    </Grid>
}

const SuccessElement = () => {
    return (
        <Grid container direction='column' sx={{py: 3}} spacing={2}>
            <Grid item>
                <CheckCircleIcon sx={{fontSize: 80, color: 'rgb(45, 206, 137)'}}/>
            </Grid>
            <Grid item>
                <Typography fontSize={24}>Your load has been booked!</Typography>
            </Grid>
            <Grid item pl={'0 !important'}>
                <Typography fontSize={24}>Moved to your personal load board</Typography>
            </Grid>
        </Grid>
    )
}

const BookNowForm = (props) => {
    const {location: {state: row = {}} = {}} = props,
        {loadNumber} = row;
    const [form, setForm] = useState({emptyDate: new Date(), emptyTime: new Date()}),
        [isBookingDone, setIsBookingDone] = useState(false),
        [isProcessingAsyncReq, setIsProcessingAsyncReq] = useState(false),
        {data, loading} = useFetch(GET_SECRETS_MANAGER, null, {
            queryParams: {
                orgId: getUserDetail().user.orgId
            },
        }),
        {_dbData: {chRobinson: { tCode } = {}} = {}} = data || {};

    const config = {
        paperProps: {
            sx: {
                width: 'auto'
            }
        }
    }
    let defaultCost = 0;

    if (row.hasOwnProperty("availableLoadCosts")) {
        const {availableLoadCosts = []} = row || {};
        const [item] = availableLoadCosts || [];
        if (item) {
            defaultCost = item.sourceCostPerUnit
        }
    }
    const afterBookNow = ({success = false}) => {
        if (success) {
            setIsBookingDone(true);
            saveCHLoadToDb(row, true);
            triggerCustomEvent('getBiddings')
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const date = form.emptyDate.toDateString(),
            time = form.emptyTime.toTimeString(),
            dateTime = new Date(date + " " + time);

        if (dateTime < new Date()) {
            return notification('Empty Date and Time cannot be a past', 'error')
        }
        setIsProcessingAsyncReq(true)
        const {loadNumber, availableLoadCosts} = row,
            {type, code, description, units, currencyCode, sourceCostPerUnit} = availableLoadCosts[0] || {};
        const {user: {name = '', email = ''} = {}} = getUserDetail();

        const payload = {
            loadNumber,
            carrierCode: tCode,
            emptyDateTime: new Date(date + " " + time).toISOString(),
            availableLoadCosts: [{
                type, code, description, units, currencyCode, sourceCostPerUnit
            }],
            emptyLocation: {
                "city": "Greenwood",
                "state": "IN",
                "country": "NA",
                "zip": "46143"
            },
            rateConfirmation: {
                email,
                name
            }
        }
        // Object.assign(payload, {defaultEmail: "vy4693@gmail.com", env: "dev"});
        saveCHLoadToDb(row, false)
            .then((response) => {
                const {success, message} = response?.data || {}
                if (success) {
                    bookChRobinsonLoad(payload)
                        .then(r => {
                            setIsProcessingAsyncReq(false);
                            if (r.status === 200) {
                                afterBookNow({success: true});
                                notification('Booking successful');
                            } else {
                                console.log(r)
                                notification(r.data?.message || '', 'error')
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            setIsProcessingAsyncReq(false);
                            notification(err.message, 'error');
                        })
                } else {
                    notification(message, 'error')
                    setIsProcessingAsyncReq(false);

                }
            })
    }

    return (
        <Modal config={config}>
            <form noValidate onSubmit={onSubmit}>
                <Grid container direction={'column'} textAlign={'center'} px={8} pb={4} gap={'10px'}>
                    <Grid item>
                        <Typography sx={{fontSize: 32}}>C.H Robinson</Typography>
                    </Grid>
                    <Grid item direction={''} display={'flex'} justifyContent={'center'}>
                        <Typography sx={{fontSize: 32, mr: 2}}>Load Number: </Typography>
                        <Typography sx={{fontSize: 32}}>{loadNumber}</Typography>
                    </Grid>
                    {isBookingDone ? <SuccessElement/> : <>
                        <Grid item display={'flex'} justifyContent={'space-between'} mt={2}>
                            <CustomGrid label={'Carrier T-Code'}>
                                <TextField disabled variant={'standard'} fullWidth
                                           value={tCode}
                                           readOnly/>
                            </CustomGrid>
                        </Grid>
                        <Grid item>
                            <CustomGrid label={'Empty Date'}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        slotProps={{
                                            textField: {
                                                helperText: 'MM/DD/YYYY',
                                                size: 'small'
                                            },
                                        }}
                                        disablePast
                                        value={moment(form.emptyDate || new Date())}
                                        onChange={(newValue) => setForm({...form, emptyDate: newValue})}
                                    />
                                </LocalizationProvider>
                            </CustomGrid>
                        </Grid>
                        <Grid item mt={2}>
                            <CustomGrid label={'Empty Time'}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <TimePicker
                                        value={moment(form.emptyTime || new Date())}
                                        onChange={(time) => {
                                            setForm({...form, emptyTime: time})
                                        }
                                        }
                                        slotProps={{
                                            textField: {
                                                helperText: 'hh:mm AM/PM',
                                                size: 'small'
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </CustomGrid>
                        </Grid>
                    </>}
                    {!isBookingDone && <Grid item mt={2}>
                        <Button type='submit' disabled={isProcessingAsyncReq || loading} variant={'contained'}
                                sx={{p: 2, fontSize: 16, px: 3, py: 2}}>Book Now ${defaultCost}</Button>
                    </Grid>}
                </Grid>
            </form>
        </Modal>
    )
}

export default BookNowForm;