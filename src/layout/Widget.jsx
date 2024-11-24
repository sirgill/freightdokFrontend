import {Paper as MuiPaper, Typography} from "@mui/material";
import styled from "@mui/material/styles/styled";

const Paper = styled(MuiPaper)(({theme}) => ({
    padding: '8px 16px',
}))
const Widget = ({title, children, sx={}}) => {
    return <Paper elevation={0} variant='outlined' sx={sx}>
        <Typography variant='h6' fontWeight={600}>{title}</Typography>
        {children}
    </Paper>
}

export default Widget;