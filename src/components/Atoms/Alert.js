import {Collapse, Alert as MuiAlert} from "@mui/material";
import React from "react";

const Alert = ({config, classname='', inStyles = {}}) => {
    const {open, message = '', severity = '', onClose = undefined, variant = 'standard'} = config;

    const alertProps = {
        severity: severity || undefined,
        variant
    }
    if(typeof onClose === 'function'){
        alertProps.onClose = onClose;
    }

    return <Collapse in={open} sx={inStyles}>
        <MuiAlert className={'alertbase ' + classname} {...alertProps}>
            {message}
        </MuiAlert>
    </Collapse>
}

export default Alert;