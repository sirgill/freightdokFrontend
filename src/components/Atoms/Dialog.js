import * as React from 'react';
import Button from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Dialog(props) {
    const {open, config, onClose, preventBackdropClose = false, className} = props,
        {title, onOk, okText = 'Save', content} = config;

    const handleClose = (e, reason = '') => {
        if (preventBackdropClose && reason.equalsIgnoreCase('backdropclick')) {
            return
        }
        onClose()
    }

    return (
        <div>
            <MuiDialog
                className={className}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                {typeof title === 'function' ? title({...config}) :
                    <DialogTitle sx={{fontWeight: 550}}>{title}</DialogTitle>}
                <DialogContent>
                    {typeof content === 'function' ? content({config}) : content}
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    {typeof okText === 'function' ? okText({config, onOk}) : <Button variant='contained'
                                                                                     color={okText.equalsIgnoreCase('delete') ? 'error' : 'primary'}
                                                                                     onClick={onOk}
                    >
                        {okText}
                    </Button>}
                </DialogActions>
            </MuiDialog>
        </div>
    );
}