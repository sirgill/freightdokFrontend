import * as React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Zoom } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose,showClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }} {...other}>
      {showClose ? (
          <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                left: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
          >
            <CloseIcon />
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
  const { config = {}, children } = props,
    {
      title = "",
      closeUrl = "",
      okButtonText = "Save",
        showClose = true,
      onOk = _.noop(),
      paperProps = {}
    } = config;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onOkHandler = () => {
    if (_.isFunction(onOk)) {
      onOk();
    }
    handleClose();
  };

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const Transition = useMemo(() => {
    return React.forwardRef(function Transition(props, ref) {
      const history = useHistory();
      return (
        <Zoom
          ref={ref}
          {...props}
          onExited={() => {
            return history.push(closeUrl || "/dashboard");
          }}
        />
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"xl"}
        TransitionComponent={Transition}
        PaperProps={paperProps}
      >
        {title && <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            showClose={showClose}
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
    </div>
  );
}
