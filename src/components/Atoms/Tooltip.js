import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";

const BootstrapTooltip = styled(({ className, ...props }) => (
    <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

export default function Tooltip({title, children, placement="right", ...props}) {
    return (
        <BootstrapTooltip title={title} placement={placement} {...props}>
            {children}
        </BootstrapTooltip>
    );
}

Tooltip.proptype = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    placement: PropTypes.oneOf(['right', 'left', 'bottom', 'top'])
}