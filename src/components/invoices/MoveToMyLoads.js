import Modal from "../Atoms/Modal";
import { Grid, Typography } from "@mui/material";
import Select from "../Atoms/form/Select";
import {LOAD_STATUSES} from "../constants";
import {useState} from "react";
import useMutation from "../../hooks/useMutation";
import {LoadingButton} from "../Atoms";

const config = {
    title: 'Move Invoice to My Loads',
    preventBackdropClick: true
}

const MoveToMyLoads = (props) => {
    const {onCloseUrl, getInvoices, match: {params: {id} = {}} = {}, history} = props,
        [value, setValue] = useState(),
        {mutation, loading} = useMutation('/api/invoice/moveBackToMyLoads'),
        statuses = LOAD_STATUSES.map(status => {
            if(status.id.equalsIgnoreCase('delivered')){
                return {...status, disabled: true}
            }
            return status;
        });

    const onChange = ({value}) => {
        setValue(value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        mutation({id, status: value}, null, () => {
            getInvoices();
            history.replace(onCloseUrl);
        });
    }

    return <Modal config={config}>
        <Grid container component='form' sx={{}} spacing={2} onSubmit={onSubmit}>
            <Grid item>
                <Typography>Select a load status</Typography>
            </Grid>
            <Grid item xs={12}>
                <Select
                    label='Status'
                    name='status'
                    options={statuses}
                    onChange={onChange}
                    value={value}
                    showNone={true}
                />
            </Grid>
            <Grid item xs={12}>
                <LoadingButton type='submit' fullWidth disabled={!value} isLoading={loading} loadingText='Moving...'>
                    Move
                </LoadingButton>
            </Grid>
        </Grid>
    </Modal>
}

export default MoveToMyLoads;