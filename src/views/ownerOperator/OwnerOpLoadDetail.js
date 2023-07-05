import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Modal from "./Modal";



const OwnerOpDetails = (props) => {
    const { location: { state: data = {} } = {} } = props;
    const config = {
        title: "Owner Op details"
    }
    console.log("data", data)
    const renderAccordian = ({ parentKey, key, value }) => {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{parentKey}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {value instanceof Object ? a(value) : JSON.stringify(value)}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        )
    }

    const a = (data) => {
        let b = []
        for (let key in data) {

            b.push(renderAccordian({ parentKey: key, value: data[key], key }));
        }
        return b;
    }

    return (
        <Modal config={config}>
            <Grid container spacing={2}>
                {a(data)}
            </Grid>
        </Modal>
    )
}

export default OwnerOpDetails