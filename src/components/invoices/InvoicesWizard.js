import React, { useState, useRef, useEffect } from "react";
import { Modal, Step } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useDispatch } from "react-redux";
import {
  deleteLoadDocument,
  uploadLoadDocument,
  generateInvoice,
  mergeDocuments,
  resetInvoiceGenerated,
} from "../../actions/load";
import { Page, Text, View, Document, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useStyles, styles } from "../HelperCells";
import InputField from "../Atoms/form/InputField";
import {Typography} from "@mui/material";
import {blue} from "../layout/ui/Theme";

const generatePDFDocument = async ({ from, to, load_number, broker, rate }) => {
  return new Promise(async (resolve) => {
    const blob = await pdf(
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>From</Text>
            <Text>Name: {from.name}</Text>
            <Text>Company Name: {from.company_name}</Text>
            <Text>Email: {from.email}</Text>
          </View>
          <View style={styles.section}>
            <Text>To</Text>
            <Text>Company Name: {to.company_name}</Text>
            <Text>Email: {to.email}</Text>
          </View>
          <View style={styles.section}>
            <Text>Load</Text>
            <Text>{load_number}</Text>
          </View>
          <View></View>
          <View style={styles.section}>
            <Text>Broker</Text>
            <Text>{broker ? broker : "--"}</Text>
          </View>
          <View style={styles.section}>
            <Text>Rate</Text>
            <Text>{rate ? rate : "--"}</Text>
          </View>
        </Page>
      </Document>
    ).toBlob();

    resolve(blob);
  });
};

const formInitialState = {
  from: {
    name: "",
    company_name: "",
    email: "",
  },
  to: {
    company_name: "",
    email: "",
  },
};

export default function InvoiceWizard({
  load_selected,
  handleOnClose,
  deleteDoc,
  updateDoc,
  invoiceGenerated,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  //   const [modalStyle] = useState(getModalStyle);
  const [form, setForm] = useState(formInitialState);
  const [step, setStep] = useState(1);

  const rcfr = useRef();
  const pdfr = useRef();

  const handleSubmit = async (event = null) => {
    if (event) event.preventDefault();

    dispatch(generateInvoice(load_selected._id, form));

    const blob = await generatePDFDocument({
      from: form.from,
      to: form.to,
      load_number: load_selected.loadNumber,
      broker: load_selected.brokerage,
      rate: load_selected.rate,
    });

    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      var base64data = reader.result;

      const headers = {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      };

      const dataToSend = {
        invoice: base64data,
        docs: [],
      };

      if (
        load_selected.rateConfirmation &&
        load_selected.rateConfirmation.length > 0
      ) {
        console.log("Rate Confirmation :", load_selected.rateConfirmation[0]);
        dataToSend.docs.push(load_selected.rateConfirmation[0].name);
      }

      if (
        load_selected.proofDelivery &&
        load_selected.proofDelivery.length > 0
      ) {
        console.log("Proof Delivery :", load_selected.proofDelivery[0]);
        dataToSend.docs.push(load_selected.proofDelivery[0].name);
      }

      dispatch(mergeDocuments(dataToSend, headers));
    };
  };

  useEffect(() => {
    dispatch(resetInvoiceGenerated());
  }, []);

  useEffect(() => {
    console.log("Updated :", load_selected);
    if (invoiceGenerated) {
      const file = new Blob([invoiceGenerated], {
        type: "application/pdf",
      });

      saveAs(file, "Invoice");
      dispatch(resetInvoiceGenerated());
      handleOnClose();
    }
  }, [invoiceGenerated, load_selected]);

  const handleOnChange = (event, key) => {
    const { name, value } = event.target;
    setForm((form) => ({ ...form, [key]: { ...form[key], [name]: value } }));
  };

  const changeStep = (move) => {
    const new_step = move === "next" ? step + 1 : step - 1;
    let error = false;
    let errorMsg = "";
    if (
      (step === 1 || step === 2) &&
      ((form.from.email && !validateEmail(form.from.email)) ||
        (form.to.email && !validateEmail(form.to.email)))
    ) {
      error = true;
      errorMsg = "Invalid Email";
    }
    if (
      step === 1 &&
      (!form.from.name || !form.from.company_name || !form.from.email)
    ) {
      error = true;
      errorMsg = "Please fill the form to continue.";
    }
    if (step === 2 && (!form.to.company_name || !form.to.email)) {
      error = true;
      errorMsg = "Please fill the form to continue.";
    }
    if (move === "next" && error) alert(errorMsg);
    else setStep(new_step);
  };
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const deleteDocument = (doc_type) => {
    dispatch(deleteLoadDocument(load_selected._id, doc_type, ""));
    // remove timer and get actual state of invoice to show the upload button instead of delete button on delete success
    setTimeout(() => {
      deleteDoc(doc_type);
    }, 2000);
  };
  const uploadDocument = (doc_type, documents) => {
    const file_data = [];
    for (let file of documents) {
      const { filename } = file;
      file_data.push({
        name: filename,
        date: Date.now(),
      });
    }
    dispatch(uploadLoadDocument(load_selected._id, doc_type, documents));
    setTimeout(() => {
      updateDoc(doc_type, file_data);
    }, 2000);
  };
  return (
    <Modal
      open={load_selected ? true : false}
      onClose={() => {
        handleOnClose();
        setForm(formInitialState);
        setStep(1);
      }}
    >
      <div className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} className={classes.invoicesRoot}>
            <div className={classes.modalBody}>
              {step !== 3 ? (
                <Grid item xs={12}>
                  <Typography variant='h5' color={blue} sx={{mb:3}}>{step === 1 ? "From" : "To"}</Typography>
                </Grid>
              ) : (
                ""
              )}
              {step === 1 ? (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <InputField
                        id="outlined-basic"
                        label="Name"
                        name="name"
                        value={form[step === 1 ? "from" : "to"].name}
                        onChange={(event) =>
                          handleOnChange(event, step === 1 ? "from" : "to")
                        }
                      />
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
              {step < 3 ? (
                <>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}></Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="outlined-basic"
                          label="Company Name"
                          name="company_name"
                          value={form[step === 1 ? "from" : "to"].company_name}
                          onChange={(event) =>
                            handleOnChange(event, step === 1 ? "from" : "to")
                          }
                        />
                      </Grid>
                      <Grid item xs={3}></Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}></Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="outlined-basic"
                          label="Email"
                          name="email"
                          value={form[step === 1 ? "from" : "to"].email}
                          onChange={(event) =>
                            handleOnChange(event, step === 1 ? "from" : "to")
                          }
                        />
                      </Grid>
                      <Grid item xs={3}></Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
                ""
              )}
              {step === 3 && load_selected ? (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <p>Load: {load_selected.loadNumber || "--"}</p>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <p>Broker: {load_selected.brokerage || "--"}</p>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <p>Rate: {load_selected.rate || "--"}</p>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <input
                        ref={rcfr}
                        onChange={(event) =>
                          uploadDocument("rateConfirmation", event.target.files)
                        }
                        type="file"
                        name="rateConfirmation"
                        multiple
                        style={{ opacity: 0 }}
                      />
                      <p style={{ margin: 0 }}>
                        Rate Confirmation:
                        {Array.isArray(load_selected.rateConfirmation) &&
                        load_selected.rateConfirmation.length > 0 &&
                        typeof load_selected.rateConfirmation[0] !==
                          "string" ? (
                          <Button
                            onClick={() => deleteDocument("rateConfirmation")}
                            variant="contained"
                            style={{
                              backgroundColor: "red",
                              color: "#ffffff",
                            }}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            onClick={() => rcfr.current.click()}
                            variant="contained"
                            color="primary"
                          >
                            Upload
                          </Button>
                        )}
                      </p>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                      <input
                        ref={pdfr}
                        onChange={(event) =>
                          uploadDocument("proofDelivery", event.target.files)
                        }
                        type="file"
                        name="proofDelivery"
                        multiple
                        style={{ opacity: 0 }}
                      />
                      <p style={{ margin: 0 }}>
                        Proof of Delivery:
                        {Array.isArray(load_selected.proofDelivery) &&
                        load_selected.proofDelivery.length > 0 &&
                        typeof load_selected.proofDelivery[0] !== "string" ? (
                          <Button
                            onClick={() => deleteDocument("proofDelivery")}
                            variant="contained"
                            style={{
                              backgroundColor: "red",
                              color: "#ffffff",
                            }}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            onClick={() => pdfr.current.click()}
                            variant="contained"
                            color="primary"
                          >
                            Upload
                          </Button>
                        )}
                      </p>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            </div>
            <div className={classes.modalFooter}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    {step !== 3 ? (
                      <IconButton>
                        {step > 1 ? (
                          <ArrowBackIcon onClick={() => changeStep("back")} />
                        ) : (
                          ""
                        )}
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8} className={classes.btn_container}>
                    {step !== 3 ? (
                      <IconButton>
                        {/* { step > 1 ? <ArrowBackIcon onClick={()=>changeStep('back')}/> : '' } */}
                        <ArrowForwardIcon onClick={() => changeStep("next")} />
                      </IconButton>
                    ) : (
                      ""
                    )}
                    {step === 3 ? (
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => changeStep("back")}
                          style={{ marginRight: "5px" }}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubmit()}
                        >
                          Create
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </form>
      </div>
    </Modal>
  );
}
