import {
    Button,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    Stack,
    Typography,
    Zoom,
} from "@mui/material";
import React, {useEffect, useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {blue, errorIconColor, successIconColor} from "../layout/ui/Theme";
import InputField from "../Atoms/form/InputField";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ReactToPrint from "react-to-print";
import "../../App.css";
import "./styles.css";
import InvoiceServiceWrapper from "./InvoiceService";

const Title = ({name, sx = {}, variant = "body1", children}) => {
    return (
        <Typography sx={{fontWeight: 700, ...sx}} variant={variant}>
            {children || name}
        </Typography>
    );
};

const DialogComponent = ({
                             transition,
                             handleClose,
                             open,
                             data,
                             pdf,
                             setPdf,
                             services,
                             addService
                         }) => {
    const ref = React.useRef(null);
    const {
            brokerage = "",
            loadNumber = "",
            pickup = [],
            drop = [],
            rate = "",
            accessorials = [],
            proofDelivery = [],
            rateConfirmation = [],
        } = data || {},
        [{receiverName = ""}] = drop || [],
        [{pickupAddress, pickupCity, pickupState, pickupZip}] = pickup;


    const reactToPrintContent = React.useCallback(() => {
        return ref.current;
    }, [ref.current]);


    const reactToPrintTrigger = React.useCallback(() => {
        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
        // to the root node of the returned component as it will be overwritten.

        // Bad: the `onClick` here will be overwritten by `react-to-print`
        // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

        // Good
        return (
            <Button className='printInvoice' variant={'contained'}>
                Create Invoice
            </Button>
        );
    }, []);

    return (
        <Dialog
            PaperProps={{
                sx: {width: "70%"},
            }}
            open={open}
            onClose={handleClose}
            TransitionComponent={transition}
            maxWidth={"lg"}
        >
            <DialogContent sx={{p: 0}}>
                <Grid
                    container
                    direction="column"
                    ref={ref}
                    sx={{display: pdf ? "inline-flex" : "inline-flex"}}
                >
                    <style type="text/css" media="print">{"\
                 @page {\ size: landscape;\ }\
            "}</style>
                    <Grid item xs={12} sx={{p: 3}}>
                        <Grid container justifyContent={"space-between"}>
                            <Grid item sx={{flexGrow: 1}}>
                                <Stack spacing={1}>
                                    <Stack>
                                        <Typography sx={{textAlign: "left"}} variant="h5">
                                            {'Sunny Freight'}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <Stack>
                                    <Stack>
                                        <Typography variant="h5" sx={{textAlign: "right"}}>
                                            Invoice
                                        </Typography>
                                    </Stack>
                                    <Stack>
                                        <InputField label="Notes" type="textarea"/>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{borderBottomWidth: "thin", borderColor: blue}}/>
                    <Grid xs={12} item sx={{p: 3}}>
                        <Grid container justifyContent={"space-between"}>
                            <Grid item>
                                <Stack spacing={1}>
                                    <Stack>
                                        <Typography>Bill To:</Typography>
                                    </Stack>
                                    <Stack>
                                        <Title sx={{fontWeight: 700}}>{receiverName}</Title>
                                    </Stack>
                                    <Stack>
                                        <Title name={"Services"}/>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <Stack justifyContent={"space-between"} sx={{height: "100%"}}>
                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                        <Title>Load Number</Title>
                                        <InputField value={loadNumber}/>
                                    </Stack>
                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                        <Title>Rate</Title>
                                        <div>{rate}</div>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{borderBottomWidth: "thin", borderColor: blue}}/>
                    <Grid xs={12} item sx={{p: 3}}>
                        <Grid container justifyContent={"space-between"}>
                            <Grid item>
                                <Stack>
                                    <Stack>
                                        <InputField value={"Loads"} readOnly/>
                                    </Stack>
                                    <Stack>
                                        <InputField value={"Lumper by Carrier"} readOnly/>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <Stack>
                                    <Stack>
                                        <InputField value={rate}/>
                                    </Stack>
                                    <Stack>
                                        <InputField value={"hardcode"}/>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{borderBottomWidth: "thin", borderColor: "#000"}}/>
                    <Grid item sx={{p: 2}} display={"inherit"} direction="column">
                        <Stack sx={{textAlign: "right"}}>
                            <Title>Total: - -</Title>
                        </Stack>
                        <Grid container alignItems={"end"} justifyContent={"space-between"}>
                            <Grid item xs={12}>
                                <InvoiceServiceWrapper services={services}/>
                            </Grid>
                            <Grid xs={3} item>
                                <Button variant={"contained"} size={"small"} className={'addServicesInvoice'}
                                        onClick={addService}>
                                    Add Services
                                </Button>
                            </Grid>
                            <Grid xs={6} item>
                                <Stack justifyContent={"center"} gap={"10px"}>
                                    <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                        <Typography textAlign={'center'} sx={{
                                            width: 150,
                                            background: 'rgb(0, 123, 255)',
                                            color: '#FFF',
                                            borderRadius: '4px'
                                        }}>Rate Con</Typography>
                                        <div>
                                            {rateConfirmation.length ? (
                                                <CheckCircleIcon style={{color: successIconColor}}/>
                                            ) : (
                                                <CancelIcon style={{color: errorIconColor}}/>
                                            )}
                                        </div>
                                    </Stack>
                                    <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                        <Typography textAlign={'center'} sx={{
                                            width: 150,
                                            background: 'rgb(0, 123, 255)',
                                            color: '#FFF',
                                            borderRadius: '4px'
                                        }}>
                                            Proof Of Delivery
                                        </Typography>
                                        <div>
                                            {proofDelivery.length ? (
                                                <CheckCircleIcon style={{color: successIconColor}}/>
                                            ) : (
                                                <CancelIcon style={{color: errorIconColor}}/>
                                            )}
                                        </div>
                                    </Stack>
                                    <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                        <Typography textAlign={'center'} sx={{
                                            width: 150,
                                            background: 'rgb(0, 123, 255)',
                                            color: '#FFF',
                                            borderRadius: '4px'
                                        }}>Accessorials</Typography>
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
                            <Grid xs={3} item display={"flex"} justifyContent={"end"}>
                                <ReactToPrint
                                    content={reactToPrintContent}
                                    documentTitle="AwesomeFileName"
                                    // onBeforeGetContent={handleOnBeforeGetContent}
                                    // onBeforePrint={handleBeforePrint}
                                    removeAfterPrint
                                    trigger={reactToPrintTrigger}
                                />

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

const Invoice = ({match: {params: {id = ""} = {}} = {}, history}) => {
    const [open, setOpen] = useState(false);
    const [pdf, setPdf] = useState(false);
    const invoices = useSelector((state) => state.load.invoices.data) || [],
        [services, setServices] = useState([]),
        data = invoices.find((invoice) => invoice._id === id);
    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        handleClickOpen();
    }, []);

    const handleClose = (e, reason = "") => {
        // if (reason === 'backdropClick') return
        setOpen(false);
    };

    const addService = () => {
        let obj = {
            serviceName: '',
            description: '',
            quantity: 1,
            price: '500',
            amount: '1100'
        }
        setServices([...services, obj])
        // services.push(obj);
    }

    const Transition = useMemo(() => {
        return React.forwardRef(function Transition(props, ref) {
            const history = useHistory();
            return (
                <Zoom
                    ref={ref}
                    {...props}
                    onExited={() => {
                        return history.push("/dashboard");
                    }}
                />
            );
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
    };

    return (
        <div>
            <DialogComponent
                open={open}
                handleClose={handleClose}
                transition={Transition}
                data={data}
                pdf={pdf}
                setPdf={setPdf}
                services={services}
                addService={addService}
            />
        </div>
    );
};

export default Invoice;
