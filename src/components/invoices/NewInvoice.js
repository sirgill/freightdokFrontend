import { Button, Dialog, DialogActions, DialogContent,Divider, Grid, Stack, Typography, Zoom } from '@mui/material'
import React, {useEffect, useMemo} from "react";
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom'
import {blue, errorIconColor, successIconColor} from "../layout/ui/Theme";
import InputField from "../Atoms/form/InputField";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const Title = ({name, sx={}, variant='body1', children}) => {
    return <Typography sx={{fontWeight: 700, ...sx}} variant={variant}>{children || name}</Typography>
}

const DialogComponent = ({transition, handleClose, open, data}) => {
    const { brokerage='',loadNumber='', pickup = [], drop = [], rate='', accessorials=[], proofDelivery=[], rateConfirmation=[] } = data || {},
    [{receiverName = ''}] = drop,
    [{pickupAddress, pickupCity, pickupState, pickupZip}] = pickup;

    return <Dialog PaperProps={{
        sx: {width: '70%'}
    }} open={open} onClose={handleClose} TransitionComponent={transition} maxWidth={'lg'}>
        <DialogContent sx={{p: 0}}>
            <Grid container direction='column'>
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
                <Divider sx={{borderBottomWidth: 'thin', borderColor: blue}} />
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
                                    <Title name={'Services'} />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack justifyContent={'space-between'} sx={{height: '100%'}}>
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <Title>Load Number</Title>
                                    <InputField value={loadNumber} />
                                </Stack>
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <Title>Rate</Title><div>{rate}</div>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{borderBottomWidth: 'thick', borderColor: blue}} />
                <Grid xs={12} item sx={{p: 3}}>
                    <Grid container justifyContent={'space-between'}>
                        <Grid item>
                            <Stack>
                                <Stack>
                                    <InputField value={'Loads'} readOnly />
                                </Stack>
                                <Stack>
                                    <InputField value={'Lumper by Carrier'} readOnly />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Stack>
                                    <InputField value={rate} />
                                </Stack>
                                <Stack>
                                    <InputField value={'hardcode'} />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{borderBottomWidth: 'thin', borderColor: '#000'}} />
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
                            <Button variant={'contained'} size={'small'}>Create Invoice</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
}

const Invoice = ({match: {params :{id = ''} = {}} = {}, history}) => {
    const [open, setOpen] = React.useState(false);
    const invoices = useSelector(state => state.load.invoices.data) || [],
        data = invoices.find(invoice => invoice._id === id);
    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        handleClickOpen()
    }, [])

    const handleClose = (e, reason) => {
        if(reason === 'backdropClick') return
        setOpen(false);
    };

    const Transition = useMemo(() => {
        return React.forwardRef(function Transition(props, ref) {
            const history = useHistory()
            return <Zoom ref={ref} {...props} onExited={() => {
                return history.goBack()
            }
            } />;
        });
    }, []);

    return (
        <div>
            <DialogComponent
                open={open}
                handleClose={handleClose}
                transition={Transition}
                data={data}
            />
        </div>
    );
}

export default Invoice;