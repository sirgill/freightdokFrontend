import Modal from "../../components/Atoms/Modal";
import {Grid, InputAdornment} from "@mui/material";
import {FullScreenLoader, Input, LoadingButton} from "../../components/Atoms";
import {GET_SERVICE_COSTS_EFS_TRANSACTION} from "../../config/requestEndpoints";
import {useState} from "react";
import useMutation from "../../hooks/useMutation";
import {notification} from "../../actions/alert";
import {triggerCustomEvent} from "../../utils/utils";
import {useHistory} from "react-router-dom";
import {ENHANCED_DASHBOARD} from "../../components/client/routes";
import useLazyFetch from "../../hooks/useLazyFetch";

const Body = ({id, data}) => {
    const history = useHistory();
    const {mutation, loading} = useMutation(GET_SERVICE_COSTS_EFS_TRANSACTION + `/${id}`)
    const {mutation: createServiceCostMutation, loading: isLoading} = useMutation(GET_SERVICE_COSTS_EFS_TRANSACTION)
    const [form, setForm] = useState({
        maxAmount: data?.maxAmount,
        minAmount: data?.minAmount,
        transactionCost: data?.transactionCost
    })

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (id) {
            mutation(form, 'put', afterSubmit)
        } else {
            createServiceCostMutation(form, null, afterSubmit)
        }
    }

    const afterSubmit = ({success, data}) => {
        if (success) {
            notification(data.message);
            triggerCustomEvent('refetchEfsTransactionCosts');
            history.replace(ENHANCED_DASHBOARD + '/serviceCosts')
        } else {
            notification(data.message, 'error')
        }
    }

    return <Grid container spacing={3} component='form' sx={{width: {xs: 'auto', sm: '350px'}}} onSubmit={onSubmit}>
        <Grid item xs={12}>
            <Input name='minAmount' value={form.minAmount} onChange={onChange} label='Min Amount' type='number'
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid>
        <Grid item xs={12}>
            <Input name='maxAmount' value={form.maxAmount} onChange={onChange} label='Max  Amount' type='number'
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid>
        <Grid item xs={12}>
            <Input name='transactionCost' value={form.transactionCost} onChange={onChange} label='Transaction Cost'
                   type='number' InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid>
        <Grid xs={12} item>
            <LoadingButton fullWidth isLoading={loading || isLoading}
                           type='submit'>{(loading || isLoading) ? (id ? 'Updating...' : 'Saving...') : (id ? 'Update' : 'Save')}</LoadingButton>
        </Grid>
    </Grid>
}
const EfsTransactionCostForm = (props) => {
    const {match: {params: {id}} = {}} = props;
    const {data, loading} = useLazyFetch(GET_SERVICE_COSTS_EFS_TRANSACTION + `/${id}`, {
        lazyFetchCondition: () => id !== 'new'
    });

    if (loading) {
        return <FullScreenLoader/>
    }

    return <Modal config={{title: 'Edit EFS Transaction Cost'}}>
        <Body id={id === 'new' ? null : id} data={data?.data}/>
    </Modal>
}

export default EfsTransactionCostForm;