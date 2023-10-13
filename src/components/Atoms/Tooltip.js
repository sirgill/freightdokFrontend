import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {styled} from "@mui/material/styles";

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

export default function Tooltip({title, children, placement="right"}) {
    return (
        <div>
            <BootstrapTooltip title={title} placement={placement}>
                {children}
            </BootstrapTooltip>
        </div>
    );
}