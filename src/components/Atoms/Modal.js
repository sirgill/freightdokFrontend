import React from "react";
import PropTypes from "prop-types";
import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import {useMemo} from "react";
import {useHistory} from "react-router-dom";
import {useMediaQuery, Zoom} from "@mui/material";
import {addEvent, removeEvent} from "../../utils/utils";
import {ENHANCED_DASHBOARD} from "../client/routes";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const {children, onClose, showClose,titleStyles, ...other} = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center', ...titleStyles }} {...other}>
            {showClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        left: 8,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
            {children}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function Modal(props) {
    const {config = {}, children, closeCallback} = props,
        {
            title = "",
            closeUrl = "",
            showClose = true,
            paperProps = {},
            preventBackdropClick = false,
            titleStyles = {},
            maxWidth = 'md'
        } = config;
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = (e, reason = '') => {
        if (preventBackdropClick && reason.equalsIgnoreCase('backdropClick')) {
            return;
        }
        setOpen(false);
    };


    React.useEffect(() => {
        setOpen(true);
        addEvent(window, 'closeModal', handleClose)

        return () => removeEvent(window, 'closeModal', handleClose)
    }, []);

    const Transition = useMemo(() => {
        return React.forwardRef(function Transition(props, ref) {
            const history = useHistory();
            return (
                <Zoom
                    ref={ref}
                    {...props}
                    onExited={() => {
                        return closeCallback ? closeCallback() : closeUrl ? history.push(closeUrl || ENHANCED_DASHBOARD) : history.goBack()
                    }}
                />
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby={title || "customized-dialog-title"}
            open={open}
            maxWidth={maxWidth}
            TransitionComponent={Transition}
            PaperProps={paperProps}
            fullScreen={fullScreen}
        >
            {title && <BootstrapDialogTitle
                id={title || "customized-dialog-title"}
                onClose={handleClose}
                showClose={showClose}
                titleStyles={titleStyles}
            >
                {title}
            </BootstrapDialogTitle>}
            <DialogContent dividers sx={{borderTop: 'none'}}>{children}</DialogContent>
            {/* <DialogActions>
          <Button autoFocus onClick={onOkHandler}>
            {okButtonText}
          </Button>
        </DialogActions> */}
        </BootstrapDialog>
    );
}
