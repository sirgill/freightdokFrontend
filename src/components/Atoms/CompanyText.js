import {PRIMARY_BLUE} from "../layout/ui/Theme";
import Typography from "@mui/material/Typography";
import React from "react";

const CompanyText = ({style = {}}) => {
    return <Typography align='center' sx={{
        color: PRIMARY_BLUE,
        fontWeight: 900,
        fontSize: 25,
        cursor: 'pointer',
        ...style
    }}>freightdok</Typography>
}

export default CompanyText;