import Modal from "../Atoms/Modal";
import { Grid, Typography } from "@mui/material";
import Select from "../Atoms/form/Select";
import {LOAD_STATUSES} from "../constants";
import {useState} from "react";
import useMutation from "../../hooks/useMutation";
import {LoadingButton} from "../Atoms";
import {styled} from "@mui/material/styles";

const config = {
    title: 'Move Invoice to My Loads',
    preventBackdropClick: true
}

const Container = styled(Grid)(({theme}) => ({
    [theme.breakpoints.down('sm')]: {
        width: 'auto'
    },
    [theme.breakpoints.up('sm')]: {
        width: 300
    }
}))

const MoveToMyLoads = (props) => {
    const {onCloseUrl, getInvoices, refetch, getLoadStatuses = undefined, modalConfig, match: {params: {id} = {}} = {}, history} = props,
        [value, setValue] = useState(),
        {mutation, loading} = useMutation('/api/invoice/moveToMyLoads'),
        statuses = getLoadStatuses ? getLoadStatuses(LOAD_STATUSES) : LOAD_STATUSES.map(status => {
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
            getInvoices && getInvoices();
            refetch && refetch();
            history.replace(onCloseUrl);
        });
    }

    return <Modal config={modalConfig || config}>
        <Container container component='form' spacing={2} onSubmit={onSubmit}>
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
        </Container>
    </Modal>
}

export default MoveToMyLoads;