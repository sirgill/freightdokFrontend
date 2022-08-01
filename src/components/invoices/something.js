return (
    <Dialog
        class="printThisFull"
        PaperProps={{
            sx: { width: "70 % " },
        }}
        open={open}
        onClose={handleClose}
        TransitionComponent={transition}
        maxWidth={"lg"}
    >
        <DialogContent sx={{ p: 0 }}>
            <Grid
                container
                direction="column"
                ref={ref}
                sx={{ display: pdf ? "inline-flex" : "inline-flex" }}
            >
                <style type="text/css" media="print">{"\
             @page {\ size: landscape;\ }\
        "}</style>
                <Grid item xs={12} sx={{ p: 3 }}>
                    <Grid container justifyContent={"space-between"}>
                        <Grid item sx={{ flexGrow: 1 }}>
                            <Stack spacing={1}>
                                <Stack>
                                    <Typography sx={{ textAlign: "left" }} variant="h5">
                                        {'Sunny Freight'}
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
                                <Stack>
                                    <InputField label="Notes" type="textarea" />
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
                                    <Title sx={{ fontWeight: 700 }}>{receiverName}</Title>
                                </Stack>
                                <Stack>
                                    <Title sx={{ fontWeight: 700 }}>{"C.H. Robinson"}</Title>
                                </Stack>
                            </Stack>
                            <Stack sx={{ px: 3 }}>
                                <Title name={"Services"} />
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack justifyContent={"space-between"} sx={{ height: "100%" }}>
                                <Stack direction={"row"} alignItems={"center"} spacing={2} p={3}>
                                    <Title>Load Number: </Title>
                                    <Title>{loadNumber}</Title>
                                </Stack>
                                <Stack sx={{ px: 3 }}>
                                    <Title>Rate</Title>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{ borderBottomWidth: "thin", borderColor: blue }} />
                <Grid xs={12} item sx={{ p: 3 }}>
                    <Grid container justifyContent={"space-between"}>
                        <Grid item>
                            <Stack>
                                <Stack>
                                    <InputField value={"Loads"} readOnly />
                                </Stack>
                                <Stack>
                                    <InputField value={"Lumper by Carrier"} readOnly />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Stack>
                                <Stack>
                                    <InputField value={rate} />
                                </Stack>
                                <Stack>
                                    <InputField value={"hardcode"} />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{ borderBottomWidth: "thin", borderColor: "#000" }} />
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
                            {/* <Button variant={"contained"} size={"small"} className={'addServicesInvoice'}
                                onClick={addService}>
                                Add Services
                            </Button> */}
                        </Grid>
                        <Grid xs={6} item>
                            <Stack justifyContent={"center"} gap={"10px"} className='stack_Uploaders'>
                                <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                    <label htmlFor={'rateCon'}>
                                        <Typography textAlign={'center'} sx={{
                                            width: 150,
                                            background: 'rgb(0, 123, 255)',
                                            color: '#FFF',
                                            borderRadius: '4px'
                                        }}>Rate Con</Typography>
                                        <input type={'file'} accept={'pdf'} id={'rateCon'} style={{ display: 'none' }} />
                                    </label>
                                    <div>
                                        {rateConfirmation.length ? (
                                            <CheckCircleIcon style={{ color: successIconColor }} />
                                        ) : (
                                            <CancelIcon style={{ color: errorIconColor }} />
                                        )}
                                    </div>
                                </Stack>
                                <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                    <label htmlFor={'pod'}>
                                        <Typography textAlign={'center'} sx={{
                                            width: 150,
                                            background: 'rgb(0, 123, 255)',
                                            color: '#FFF',
                                            borderRadius: '4px'
                                        }}>
                                            Proof Of Delivery
                                        </Typography>
                                        <input type={'file'} accept={'pdf'} id={'pod'} style={{ display: 'none' }} />
                                    </label>
                                    <div>
                                        {proofDelivery.length ? (
                                            <CheckCircleIcon style={{ color: successIconColor }} />
                                        ) : (
                                            <CancelIcon style={{ color: errorIconColor }} />
                                        )}
                                    </div>
                                </Stack>
                                <Stack direction={"row"} justifyContent={'center'} gap={'10px'}>
                                    <label htmlFor={'accessorials'}>
                                        <Typography textAlign={'center'} sx={{
                                            width: 150,
                                            background: 'rgb(0, 123, 255)',
                                            color: '#FFF',
                                            borderRadius: '4px'
                                        }}>Accessorials</Typography>
                                        <input type={'file'} accept={'pdf'} id={'accessorials'} style={{ display: 'none' }} />
                                    </label>
                                    <div>
                                        {accessorials.length ? (
                                            <CheckCircleIcon style={{ color: successIconColor }} />
                                        ) : (
                                            <CancelIcon style={{ color: errorIconColor }} />
                                        )}
                                    </div>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid xs={3} item display={"flex"} justifyContent={"end"}>
                            <ReactToPrint
                                content={reactToPrintContent}
                                documentTitle="Invoice"
                                // onBeforeGetContent={handleOnBeforeGetContent}
                                // onBeforePrint={handleBeforePrint}
                                removeAfterPrint
                                trigger={reactToPrintTrigger}
                            />

                        </Grid>
                        <Grid sx={{ height: 750, width: '100%', margin: '8px', display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'relative' }} className="pg-viewer">
                            {docFileViewer}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog >
);




<Dialog
    class="printThisFull"
    PaperProps={{
        sx: { width: "70 % " },
    }}
    open={open}
    onClose={handleClose}
    TransitionComponent={transition}
    maxWidth={"lg"}
>
  <div ref={ref} className="printArea">
    <DialogContent>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle="Invoice"
        // onBeforeGetContent={handleOnBeforeGetContent}
        // onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      <h1>Gonna Print 01!!!</h1>
      {docFileViewer}
    </DialogContent>
    </div>
</Dialog>
