import React from "react";
import {useSelector} from "react-redux";
import {Button, DialogContentText, Grid, Typography} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Dialog from "./Dialog";
import useMutation from "../../hooks/useMutation";
import {removeDelete} from "../../actions/component.action";
import {notification} from "../../actions/alert";

const DeleteComponent = () => {
    const {open, message, uri, body = {}, afterSuccessCb} = useSelector((state) => state.app?.deleteComponent)
    const {mutation, loading} = useMutation(uri, null, true);

    function afterSubmit({success, data}) {
        if(success){
            removeDelete();
            notification(data.message || 'Deleted Successfully');
        }
        afterSuccessCb && afterSuccessCb({success, data})
    }

    function onClose() {
        removeDelete();
    }

    const config = {
        title: () => <Grid container alignItems='center' sx={{ p: '16px 24px' }} gap={1}>
            <ErrorOutlineIcon color='error' />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 550 }} color='error'>Delete</Typography>
        </Grid>,
        okText: ({onOk}) => <Button disabled={loading} onClick={onOk} variant='contained' color='error'>{loading ? 'Deleting...' : 'Delete'}</Button>,
        onOk: () => mutation(body, 'delete', afterSubmit),
        onCancel: ({onClose}) => <Button disabled={loading} variant='outlined' onClick={onClose}>Cancel</Button>,
        content: () => <DialogContentText sx={{color: '#000'}}>{message}</DialogContentText>
    }

    return <Dialog
        open={open}
        config={config}
        onClose={onClose}
        className='deleteDialogBox'
    />
}

export default DeleteComponent;