import {Paper as MuiPaper, Typography} from "@mui/material";
import styled from "@mui/material/styles/styled";
import PropTypes from "prop-types";

const Paper = styled(MuiPaper)(({}) => ({
    padding: '8px 16px',
}))
const Widget = ({title, children, sx={}, titleSx={}, variant='outlined'}) => {
    return <Paper elevation={0} variant={variant} sx={sx}>
        <Typography variant='h6' fontWeight={600} sx={titleSx}>{title}</Typography>
        {children}
    </Paper>
}


export default Widget;

Widget.proptype = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    placement: PropTypes.oneOf(['right', 'left', 'bottom', 'top']),
    sx: PropTypes.object,
    titleSx: PropTypes.object,
    variant: PropTypes.oneOf(['outlined', 'elevation'])
}