import {Button, Dialog, DialogActions, DialogContent, Divider, Grid, Stack, Typography, Zoom} from '@mui/material'
import React, {useEffect, useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom'
import {blue, errorIconColor, successIconColor} from "../layout/ui/Theme";
import InputField from "../Atoms/form/InputField";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Pdf from "react-to-pdf";
import "../../App.css"

const Title = ({name, sx = {}, variant = 'body1', children}) => {
    return <Typography sx={{fontWeight: 700, ...sx}} variant={variant}>{children || name}</Typography>
}

const DialogComponent = ({transition, handleClose, open, data, pdf, setPdf}) => {
    const ref = React.createRef();
    const {brokerage = '', loadNumber = '', pickup = [], drop = [], rate = '', accessorials = [], proofDelivery = [], rateConfirmation = []} = data || {},
        [{receiverName = ''}] = drop,
        [{pickupAddress, pickupCity, pickupState, pickupZip}] = pickup;

    const options = {
        orientation: 'landscape',
        unit: 'in',
        format: [6,9]
    };

    return <Dialog PaperProps={{
        sx: {width: '70%'}
    }} open={open} onClose={handleClose} TransitionComponent={transition} maxWidth={'lg'}>
        <Grid container direction='column' ref={ref} className={pdf ? '' : 'display-none'}>
            <Grid item xs={12} sx={{p: 3}}>
                <Grid container justifyContent={'space-between'}>
                    <Grid item sx={{flexGrow: 1}}>
                        <Stack spacing={1}>
                            <Stack>
                                <Typography sx={{textAlign: 'left'}} variant='h5'>{brokerage}</Typography>
                            </Stack>
                            // <Stack>
                            //     {pickupAddress}
                            // </Stack>
                            <Stack>
                                {pickupCity}, {pickupState} {pickupZip}
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack>
                            <Stack><Typography variant='h5' sx={{textAlign: 'right'}}>Invoice</Typography></Stack>
                            <Stack>
                                <InputField
                                    label='Notes'
                                    type='textarea'
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{borderBottomWidth: 'thin', borderColor: blue}}/>
            <Grid xs={12} item sx={{p: 3}}>
                <Grid container justifyContent={'space-between'}>
                    <Grid item>
                        <Stack spacing={1}>
                            <Stack>
                                <Typography>Bill To:</Typography>
                            </Stack>
                            <Stack>
                                <Title sx={{fontWeight: 700}}>
                                    {brokerage}
                                </Title>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack justifyContent={'space-between'} sx={{height: '100%'}}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Title>Load Number</Title>
                                <InputField value={loadNumber}/>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Title>Rate</Title>
                                <div>{rate}</div>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{borderBottomWidth: 'thick', borderColor: blue}}/>
            <Grid xs={12} item sx={{p: 3}}>
                <Grid container justifyContent={'space-between'}>
                    <Grid item>
                        <Stack>
                            <Stack>
                                <InputField value={'Loads'} readOnly/>
                            </Stack>
                            <Stack>
                                <InputField value={'Lumper by Carrier'} readOnly/>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack>
                            <Stack>
                                <InputField value={rate}/>
                            </Stack>
                            <Stack>
                                <InputField value={'hardcode'}/>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <DialogContent sx={{p: 0}}>
            <Grid container direction='column' sx={{display: pdf?'none':'inline-flex'}}>
                <Grid item xs={12} sx={{p: 3}}>
                    <Grid container justifyContent={'space-between'}>
                        <Grid item sx={{flexGrow: 1}}>
                            <Stack spacing={1}>
                                <Stack>
                                    <Typography sx={{textAlign: 'left'}} variant='h5'>{brokerage}</Typography>
                                </Stack>
                                <Stack>
                                    {pickupAddress}
                                </Stack>
                                <Stack>
                                    {pickupCity}, {pickupState} {pickupZip}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Stack><Typography variant='h5' sx={{textAlign: 'right'}}>Invoice</Typography></Stack>
                                <Stack>
                                    <InputField
                                        label='Notes'
                                        type='textarea'
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{borderBottomWidth: 'thin', borderColor: blue}}/>
                <Grid xs={12} item sx={{p: 3}}>
                    <Grid container justifyContent={'space-between'}>
                        <Grid item>
                            <Stack spacing={1}>
                                <Stack>
                                    <Typography>Bill To:</Typography>
                                </Stack>
                                <Stack>
                                    <Title sx={{fontWeight: 700}}>
                                        {receiverName}
                                    </Title>
                                </Stack>
                                <Stack>
                                    <Title name={'Services'}/>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack justifyContent={'space-between'} sx={{height: '100%'}}>
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <Title>Load Number</Title>
                                    <InputField value={loadNumber}/>
                                </Stack>
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <Title>Rate</Title>
                                    <div>{rate}</div>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{borderBottomWidth: 'thick', borderColor: blue}}/>
                <Grid xs={12} item sx={{p: 3}}>
                    <Grid container justifyContent={'space-between'}>
                        <Grid item>
                            <Stack>
                                <Stack>
                                    <InputField value={'Loads'} readOnly/>
                                </Stack>
                                <Stack>
                                    <InputField value={'Lumper by Carrier'} readOnly/>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Stack>
                                    <InputField value={rate}/>
                                </Stack>
                                <Stack>
                                    <InputField value={'hardcode'}/>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{borderBottomWidth: 'thin', borderColor: '#000'}}/>
                <Grid item sx={{p: 2}} display={'inherit'} direction='column'>
                    <Stack sx={{textAlign: 'right'}}>
                        <Title>Total: 1061</Title>
                    </Stack>
                    <Grid container alignItems={'end'} justifyContent={'space-between'}>
                        <Grid xs={3} item>
                            <Button variant={'contained'} size={'small'}>Add Service</Button>
                        </Grid>
                        <Grid xs={6} item>
                            <Stack justifyContent={'center'}>
                                <Stack direction={'row'}>
                                    <Typography>Rate Con</Typography>
                                    <div>
                                        {rateConfirmation.length ? (
                                            <CheckCircleIcon style={{color: successIconColor}}/>
                                        ) : (
                                            <CancelIcon style={{color: errorIconColor}}/>
                                        )}
                                    </div>
                                </Stack>
                                <Stack direction={'row'}>
                                    <Typography>POD</Typography>
                                    <div>
                                        {proofDelivery.length ? (
                                            <CheckCircleIcon style={{color: successIconColor}}/>
                                        ) : (
                                            <CancelIcon style={{color: errorIconColor}}/>
                                        )}
                                    </div>
                                </Stack>
                                <Stack direction={'row'}>
                                    <Typography>Accessorials</Typography>
                                    <div>
                                        {accessorials.length ? (
                                            <CheckCircleIcon style={{color: successIconColor}}/>
                                        ) : (
                                            <CancelIcon style={{color: errorIconColor}}/>
                                        )}
                                    </div>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid xs={3} item display={'flex'} justifyContent={'end'}>
                            <Pdf targetRef={ref} filename={`${loadNumber}_${brokerage}`+'.pdf'} options={options} onComplete={() => {
                                setPdf(false);
                                handleClose()
                            }}>
                                {({ toPdf }) => <Button variant={'contained'} size={'small'} onClick={() => {
                                    setPdf(true);
                                    toPdf();
                                }}>Generate Pdf</Button>}
                            </Pdf>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
}

const Invoice = ({match: {params: {id = ''} = {}} = {}, history}) => {
    const [open, setOpen] = useState(false);
    const [pdf, setPdf] = useState(false)
    const invoices = useSelector(state => state.load.invoices.data) || [],
        data = invoices.find(invoice => invoice._id === id);
    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        handleClickOpen()
    }, [])

    const handleClose = (e, reason='') => {
        if (reason === 'backdropClick') return
        setOpen(false);
    };

    const Transition = useMemo(() => {
        return React.forwardRef(function Transition(props, ref) {
            const history = useHistory()
            return <Zoom ref={ref} {...props} onExited={() => {
                return history.push('/dashboard')
            }
            }/>;
        });
    }, []);

    const createInvoice = async () => {
        // const blob = await pdf(
        //     <Document>
        //         <Page size="A4">
        //             <View>
        //                 jugal
        //             </View>
        //         </Page>
        //     </Document>
        // ).toBlob()
        // console.log(blob)
    }

    return (
        <div>
            <DialogComponent
                open={open}
                handleClose={handleClose}
                transition={Transition}
                data={data}
                pdf={pdf}
                setPdf={setPdf}
            />
        </div>
    );
}

export default Invoice;
