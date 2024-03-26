import React from "react";
import { ErrorOutline } from "@mui/icons-material";
import { Paper, Typography } from "@mui/material";

const BrokerSetupMessage = ({ message }) => {
    return <Paper elevation={0} sx={{ height: '500px', alignItems: 'center', display: 'flex', justifyContent: 'center', gap: 1 }}>
        <ErrorOutline color='warning' />
        <Typography align='center'>{message}</Typography>
    </Paper>
}

export default BrokerSetupMessage