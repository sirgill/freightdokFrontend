import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert as MuiAlert, Snackbar, Slide } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NOTIFICATION } from "../../actions/types";

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} {...props} />;
});

const theme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'inherit'
                }
            }
        },
        MuiAlert: {
            variants: [
                {
                    props: () => ({ variant: 'contained' }),
                    style: {
                        // border: '1px solid green',
                        background: 'rgb(237, 247, 23   7, 0.5)'
                    }

                }
            ]
        }
    }
})

const Notification = () => {
    const dispatch = useDispatch();
    const { app: { notification = {} } = {} } = useSelector(state => state),
        { open, type = 'success', message = '', id, delay = 3000 } = notification;

    const handleClose = (e, reason) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch({ type: NOTIFICATION, payload: { ...notification, open: false } })
    }

    return <ThemeProvider theme={theme}>
        <Snackbar
            open={open}
            onClose={handleClose}
            key={id}
            autoHideDuration={delay}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={SlideTransition}
            sx={{
                '.alert_success': {
                    border: '1px solid green'
                },
                '.alert_error': {
                    border: '1px solid red'
                },
            }}
        >
            <Alert severity={type} sx={{ width: '100%' }} elevation={5} className={'alert_' + type}>
                {message}
            </Alert>
        </Snackbar>
    </ThemeProvider>
}

export default Notification;