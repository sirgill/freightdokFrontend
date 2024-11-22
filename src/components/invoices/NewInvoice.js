// import jsPDF from "jspdf";
// import  'jspdf-autotable'
import {Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Stack, Typography, Zoom,} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {blue} from "../layout/ui/Theme";
import InputField from "../Atoms/form/InputField";
import ReactToPrint from "react-to-print";
import "../../App.css";
import "./styles.css";
import InvoiceServiceWrapper from "./InvoiceService";
import {getCheckStatusIcon, getDollarPrefixedPrice, getUserDetail} from "../../utils/utils";
import useFetch from "../../hooks/useFetch";
import {GET_LOAD_HISTORY} from "../../config/requestEndpoints";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";


const Title = ({ name, sx = {}, variant = "body1", children }) => {
    return (
        <Typography sx={{ fontWeight: 700, ...sx }} variant={variant}>
            {children || name}
        </Typography>
    );
};

const Temporray = React.forwardRef((props, ref) => {
    const {pdf,
        setNotes,
        brokerage,
        loadNumber,
        getTotal,
        onChangeService,
        services,
        addService,
        deleteService,
        notes,
        rateConfirmation,
        proofDelivery,
        accessorials,
        reactToPrintContent,
        reactToPrintTrigger,
        docFileViewer} = props;
    const {orgName} = getUserDetail().user;
    return <div ref={ref} className="printArea">
        <Grid
            container
            direction="column"
            sx={{ display: pdf ? "inline-flex" : "inline-flex" }}
        >
            <style type="text/css" media="print">{"\
               @page {\ size: portrait;\ }\
          "}</style>
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent={"space-between"}>
                    <Grid item sx={{ flexGrow: 1 }}>
                        <Stack spacing={1}>
                            <Stack>
                                <Typography sx={{ textAlign: "left" }} variant="h5">
                                    {orgName}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack>
                            <Stack>
                                <Typography variant="h5" sx={{ textAlign: "right" }}>
                                    Invoice
                                </Typography>
                            </Stack>
                            <Stack className='notesStack'>
                                <InputField label="Notes" type="textarea" onChange={(e) => setNotes(e.target.value)} />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: "thin", borderColor: blue }} />
            <Grid xs={12} item>
                <Grid container justifyContent={"space-between"}>
                    <Grid item>
                        <Stack spacing={1} sx={{ p: 3 }}>
                            <Stack>
                                <Typography>Bill To:</Typography>
                            </Stack>
                            <Stack>
                                <Title sx={{ fontWeight: 700 }}>{brokerage}</Title>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack justifyContent={"space-between"} sx={{ height: "100%" }}>
                            <Stack direction={"row"} alignItems={"center"} spacing={2} p={3}>
                                <Title>Load Number: </Title>
                                <Title>{loadNumber}</Title>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: "thin", borderColor: blue }} />

            <Grid item sx={{ p: 2 }} display={"inherit"} direction="column">
                <Stack sx={{ textAlign: "right" }}>
                    <Title>Total: {getTotal() || '- -'}</Title>
                </Stack>
                <Grid container alignItems={"end"} justifyContent={"space-between"}>
                    <Grid item xs={12} className='invoiceServiceWrapperGrid'>
                        <InvoiceServiceWrapper
                            onChangeService={onChangeService} services={services} onAddNewService={addService}
                            deleteService={deleteService}
                        />
                    </Grid>
                    <Grid xs={3} item>
                        <Typography className='notesPrintBlock'>Notes: {notes || 'N.A'}</Typography>
                    </Grid>
                    <Grid xs={5} item>
                        <Stack justifyContent={"center"} gap={"10px"} className='stack_Uploaders'>
                            <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                <label htmlFor={'rateCon'}>
                                    <Typography textAlign={'center'} sx={{
                                        width: 150,
                                        background: 'rgb(0, 123, 255)',
                                        color: '#FFF',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        Rate Con
                                    </Typography>
                                    <input type={'file'} accept={'pdf'} id={'rateCon'} style={{ display: 'none' }} />
                                </label>
                                <div>
                                    {getCheckStatusIcon(!!rateConfirmation.length)}
                                </div>
                            </Stack>
                            <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                <label htmlFor={'pod'}>
                                    <Typography textAlign={'center'} sx={{
                                        width: 150,
                                        background: 'rgb(0, 123, 255)',
                                        color: '#FFF',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>
                                        Proof Of Delivery
                                    </Typography>
                                    <input type={'file'} accept={'pdf'} id={'pod'} style={{ display: 'none' }} />
                                </label>
                                <div>
                                    {getCheckStatusIcon(!!proofDelivery.length)}
                                </div>
                            </Stack>
                            <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                <label htmlFor={'accessorials'}>
                                    <Typography textAlign={'center'} sx={{
                                        width: 150,
                                        background: 'rgb(0, 123, 255)',
                                        color: '#FFF',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>Accessorials</Typography>
                                    <input type={'file'} accept={'pdf'} id={'accessorials'} style={{ display: 'none' }} />
                                </label>
                                <div>
                                    {getCheckStatusIcon(!!accessorials.length)}
                                </div>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid xs={3} item display={"flex"} justifyContent={"end"}>
                        <ReactToPrint
                            content={reactToPrintContent}
                            documentTitle="Invoice"
                            removeAfterPrint
                            trigger={reactToPrintTrigger}
                            pageStyle={'portrait'}
                            onPrintError={(e) => console.error("React to print error", e)}
                            onBeforePrint={() => new Promise(resolve => {
                                setTimeout(() => {
                                    console.log('waiting for print')
                                    resolve("")
                                }, 1000)
                            })}
                            fonts={[{family: "Open Sans", source:""}]}
                        />
                        {/*<Button variant='contained' onClick={createPdf}>Print Invoice</Button>*/}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        {docFileViewer}
    </div>
})

const DialogComponent = ({
    transition,
    handleClose,
    open,
    data,
    pdf,
    getTotal,
    services,
    addService,
    onChangeService,
    deleteService,
    notes,
    setNotes, saveServices,
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
        bucketFiles
    } = data || {};


    const PdfViewer = ({ pdfUrl, pdfFileName }) => {
        const [pages, setPages] = useState([]);
        useEffect(() => {

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
            script.async = true;
            script.onload = async () => {
                // Once PDF.js script is loaded, fetch and render PDF


                const blob = await fetch(`https://cors.freightdok.io/${pdfUrl}`)
                    .then(response => {
                        const contentType = response.headers.get('content-type');
                        if (contentType.equalsIgnoreCase('application/pdf'))
                            return response.blob();
                        else
                            return null;
                    })

                if (blob) {
                    {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const pdf = reader.result;
                            // Initialize PDF.js library
                            const pdfjsLib = window['pdfjs-dist/build/pdf'];
                            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

                            // Load PDF document
                            pdfjsLib.getDocument({ data: pdf }).promise.then(pdfDocument => {
                                const numPages = pdfDocument.numPages;
                                const promises = [];
                                for (let i = 1; i <= numPages; i++) {
                                    promises.push(pdfDocument.getPage(i));
                                }
                                Promise.all(promises).then(pages => {
                                    const pagePromises = pages.map(page => {
                                        const viewport = page.getViewport({ scale: 2 });
                                        const canvas = document.createElement('canvas');
                                        const context = canvas.getContext('2d');
                                        canvas.height = viewport.height;
                                        canvas.width = viewport.width;

                                        const renderContext = {
                                            canvasContext: context,
                                            viewport: viewport
                                        };
                                        return page.render(renderContext).promise.then(() => {
                                            return canvas.toDataURL();
                                        });
                                    });
                                    Promise.all(pagePromises).then(pageImages => {
                                        setPages(pageImages);
                                    });
                                });
                            });
                        };
                        reader.readAsArrayBuffer(blob);
                    }
                }
                else {
                    setPages(false)
                }
            };
            document.body.appendChild(script);
        }, [pdfUrl]);

        if (pages) {
            return (
                <>
                    <div style={{ position: 'relative', minHeight: '100vh' }}>
                        {pages.map((page, index) => (
                            <img
                                key={index}
                                src={page}
                                alt={`Page ${index + 1}`}
                                style={{ width: '100%', /* position: 'absolute', top: `${index * 100}%`, left: 0,*/ }}
                            />
                        ))}
                    </div>
                </>
            );
        }
        else {
            return (<>
                <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
                    <img className="printThisFull" src={pdfUrl} alt={pdfFileName} style={{width: '1100px', height: '1200px', objectFit: 'contain'}} />
                </Box>
            </>)
        }
    };


    const docFileViewer = React.useMemo(() => {
        return bucketFiles && bucketFiles.map(doc => {
            return (<div className="bucketImageContainer">
                <div>
                    <PdfViewer pdfUrl={doc.fileLocation} pdfFileName={doc.fileName} />
                    {/* <img className="printThisFull" src={doc.fileLocation} alt={doc.fileName} /> */}
                </div>
            </div>)
        })
    }, [bucketFiles])

    const reactToPrintContent = React.useCallback(() => {
        if(saveServices){
            saveServices();
        }
        return ref.current;
    }, [ref.current, saveServices]);


    const reactToPrintTrigger = React.useCallback(() => {
        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
        // to the root node of the returned component as it will be overwritten.

        // Bad: the `onClick` here will be overwritten by `react-to-print`
        // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

        // Good
        return (
            <Button className='printInvoice' variant={'contained'} disabled={!services.length}>
                Create Invoice
            </Button>
        );
    }, [services]);

    return (
        <Dialog
            className="printThisFull"
            PaperProps={{
                sx: { width: "70%" },
            }}
            open={open}
            onClose={handleClose}
            TransitionComponent={transition}
            maxWidth={"lg"}
        >
            <DialogContent sx={{ p: 0 }}>
                <Temporray
                    ref={ref}
                    pdf={pdf}
                    setNotes={setNotes}
                    brokerage={brokerage}
                    loadNumber={loadNumber}
                    getTotal={getTotal}
                    onChangeService={onChangeService}
                    services={services}
                    addService={addService}
                    deleteService={deleteService}
                    notes={notes}
                    rateConfirmation={rateConfirmation}
                    proofDelivery={proofDelivery}
                    accessorials={accessorials}
                    reactToPrintContent={reactToPrintContent}
                    docFileViewer={docFileViewer}
                    reactToPrintTrigger={reactToPrintTrigger}
                />
            </DialogContent>
        </Dialog >
    );
};

const Invoice = ({ match: { params: { id = "" } = {} } = {} }) => {
    const [open, setOpen] = useState(false);
    const [pdf, setPdf] = useState(false);
    const [services, setServices] = useState([]),
        [notes, setNotes] = useState(''),
        {mutation, loading} = useMutation('/api/create-invoicev2', null),
        {data: {data = {}} = {}} = useFetch(GET_LOAD_HISTORY + `/${id}`),
        {loadNumber = null} = data || {};

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

    const addService = (service) => {
        const { label, cost } = service;
        let obj = {
            serviceName: label,
            description: '',
            quantity: 1,
            price: cost,
            amount: cost
        }
        setServices([...services, obj])
    }

    const onChangeService = (index, { name, value }) => {
        const row = services[index];
        row[name] = value;
        const clone = [...services];
        clone[index] = row
        setServices(clone);
    }

    const Transition = useMemo(() => {
        return React.forwardRef(function Transition(props, ref) {
            const history = useHistory();
            return (
                <Zoom
                    ref={ref}
                    {...props}
                    onExited={() => {
                        return history.goBack();
                    }}
                />
            );
        });
    }, []);

    const getTotal = useCallback(() => {
        const total = services.reduce((acc, service) => parseFloat(service.amount) + acc, 0)
        return getDollarPrefixedPrice(total.toFixed(2))
    }, [services]);

    const deleteService = (index) => {
        const data = services
        data.splice(index, 1)
        setServices([...data])
    }

    const saveServices = () => {
        const data = {
            services, notes, loadNumber
        }
        mutation(data, 'post', ({data, success}) => {
            if(!success){
                notification(data.message || 'Error Saving services', 'error')
            }
        });
    }

    // const createInvoice = async () => {
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
    // };

    return (
        <>
            <DialogComponent
                open={open}
                handleClose={handleClose}
                transition={Transition}
                data={data}
                pdf={pdf}
                services={services}
                addService={addService}
                onChangeService={onChangeService}
                getTotal={getTotal}
                deleteService={deleteService}
                notes={notes}
                setNotes={setNotes}
                saveServices={saveServices}
            />
        </>
    );
};

export default Invoice;
