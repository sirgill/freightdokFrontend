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

function validateForm({minAmount, maxAmount, transactionCost}) {
    let valid = true, errors = {};
    if(!minAmount){
        valid = false;
        errors.minAmount = 'Enter Minimum Amount'
    }
    if(!maxAmount){
        valid = false;
        errors.maxAmount = 'Enter Maximum Amount'
    }
    if(!transactionCost){
        valid = false;
        errors.transactionCost = 'Enter Transaction Cost'
    }
    return  {valid, errors}
}

const Body = ({id, data, efsData}) => {
    const history = useHistory();
    const {mutation, loading} = useMutation(GET_SERVICE_COSTS_EFS_TRANSACTION + `/${id}`)
    const {mutation: createServiceCostMutation, loading: isLoading} = useMutation(GET_SERVICE_COSTS_EFS_TRANSACTION)
    const [form, setForm] = useState({
        maxAmount: data?.maxAmount,
        minAmount: data?.minAmount,
        transactionCost: data?.transactionCost
    }),
        [errors,setErrors] = useState({});

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
        setErrors({...errors, [name]: ''})
    }

    function validateRange(minAmount, maxAmount) {
        for (const range of efsData) {
            if (
                (minAmount >= range.minAmount && minAmount <= range.maxAmount) ||
                (maxAmount >= range.minAmount && maxAmount <= range.maxAmount) ||
                (minAmount <= range.minAmount && maxAmount >= range.maxAmount)
            ) {
                console.log(`Range (${minAmount}-${maxAmount}) overlaps with existing range (${range.minAmount}-${range.maxAmount}).`)
                return false
            }
        }
        console.log(`Range (${minAmount}-${maxAmount}) is valid and does not overlap.`);
        return true;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const {valid, errors} = validateForm(form);
        if(!valid) {
            return setErrors(errors);
        }
        const isValid = validateRange(form.minAmount, form.maxAmount)
        if(!isValid){
            notification('This range conflicts with the previous range', 'error');
            return;
        }
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

    return <Grid container spacing={3} component='form' sx={{width: {xs: 'auto'}}} onSubmit={onSubmit}>
        <Grid item xs={12}>
            <Input name='minAmount' value={form.minAmount} onChange={onChange} label='Minimum Amount' errors={errors} type='number' autoFocus
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid>
        <Grid item xs={12}>
            <Input name='maxAmount' value={form.maxAmount} onChange={onChange} label='Maximum  Amount' errors={errors} type='number'
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid>
        <Grid item xs={12}>
            <Input name='transactionCost' value={form.transactionCost} onChange={onChange} label='Transaction Cost' errors={errors}
                   type='number' InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid>
        <Grid xs={12} item>
            <LoadingButton fullWidth isLoading={loading || isLoading}
                           type='submit'>{(loading || isLoading) ? (id ? 'Updating...' : 'Saving...') : (id ? 'Update' : 'Save')}</LoadingButton>
        </Grid>
    </Grid>
}
const EfsTransactionCostForm = (props) => {
    const {match: {params: {id}} = {}, data: efsData} = props;
    const {data, loading} = useLazyFetch(GET_SERVICE_COSTS_EFS_TRANSACTION + `/${id}`, {
        lazyFetchCondition: () => id !== 'new'
    });

    if (loading) {
        return <FullScreenLoader/>
    }

    return <Modal config={{title: 'Edit EFS Transaction Cost', preventBackdropClick: true, maxWidth: 'sm'}}>
        <Body id={id === 'new' ? null : id} data={data?.data} efsData={efsData} />
    </Modal>
}

export default EfsTransactionCostForm;