import Modal from "../../../components/Atoms/Modal";
import Grid2 from "@mui/material/Unstable_Grid2";
import {FullScreenLoader, Input, LoadingButton} from "../../../components/Atoms";
import {useMemo, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import {GET_SERVICE_COSTS_OWNER_OPERATOR} from "../../../config/requestEndpoints";
import {InputAdornment} from "@mui/material";
import useMutation from "../../../hooks/useMutation";
import {notification} from "../../../actions/alert";
import {parseObjectValueToFloat, triggerCustomEvent} from "../../../utils/utils";
import {useHistory} from "react-router-dom";
import {ENHANCED_DASHBOARD} from "../../../components/client/routes";

const Form = ({id, data}) => {
    const [form ,setForm] = useState(data),
        history = useHistory();
    const [additionalCostsForm, setAdditionalCostsForm] = useState(data.additionalCosts)
    const {mutation, loading} = useMutation(GET_SERVICE_COSTS_OWNER_OPERATOR+`/${id}`)
    const {additionalCosts} = data;
    const additionalCostsInput = useMemo(() => {
        const inputs = []
        for(let i in additionalCosts){
            inputs.push(<Grid2 xs={12} key={i} md={6}>
                <Input name={i} value={additionalCostsForm[i]} type='number' label={i} onChange={additionalCostsOnChange}
                       onBlur={additionalCostsOnBlur}
                       InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
            </Grid2>)
        }
        return inputs;
    }, [additionalCostsForm, additionalCosts]);

    function additionalCostsOnChange({name, value}) {
        setAdditionalCostsForm((prev) => ({...prev, [name]: value}))
    }
    function additionalCostsOnBlur ({name, value}) {
        setAdditionalCostsForm((prev) => ({...prev, [name]: value || 0}));
    }

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
    }

    function onBlur ({name, value}) {
        setForm({...form, [name]: parseFloat(value) || 0});
    }

    const onSubmit = e => {
        e.preventDefault();
        const {lease,truckInsurance,trailerInsurance,eld, parking} = form;
        const body = parseObjectValueToFloat({lease, truckInsurance, trailerInsurance, eld, parking, additionalCosts: additionalCostsForm})
        mutation(body, 'put')
            .then(({success, data}) => {
                if(success){
                    history.replace(ENHANCED_DASHBOARD + '/serviceCosts');
                    notification(data.message);
                    triggerCustomEvent('refetchServiceCosts');
                } else {
                    notification(data.message, 'error')
                }
            })
    }

    return <Grid2 spacing={2} container sx={{maxWidth: {xs: 'auto', sm: 'auto'}}} component='form' onSubmit={onSubmit}>
        <Grid2 xs={12} md={6}>
            <Input name='lease' value={form?.lease}  type='number' label='Lease (%)' autoFocus onChange={onChange} onBlur={onBlur}
                   InputProps={{startAdornment: <InputAdornment position="start">%</InputAdornment>}}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
            <Input name='truckInsurance' value={form?.truckInsurance} type='number' label='Truck Insurance' onChange={onChange} onBlur={onBlur}
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
            <Input name='trailerInsurance' value={form?.trailerInsurance} type='number' label='Trailer Insurance' onChange={onChange} onBlur={onBlur}
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
            <Input name='eld' value={form?.eld} type='number' label='ELD' onChange={onChange} onBlur={onBlur}
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid2>
        <Grid2 xs={12} md={6}>
            <Input name='parking' value={form?.parking} type='number' label='Parking' onChange={onChange} onBlur={onBlur}
                   InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
        </Grid2>
        {additionalCostsInput}
        <Grid2 xs={12}>
            <LoadingButton type='submit' fullWidth isLoading={loading} loadingText='Updating...'>Update</LoadingButton>
        </Grid2>
    </Grid2>
}
const OwnerOperatorServiceCostsForm = ({match}) => {
    const {params : {id}} = match;
    const {data, loading} = useFetch(GET_SERVICE_COSTS_OWNER_OPERATOR+`/${id}`)

    if(loading){
        return <FullScreenLoader />
    }
    return <Modal config={{title: 'Edit Service Cost', preventBackdropClick: true, maxWidth: 'sm'}}>
        <Form id={id} data={data?.data || {}}/>
    </Modal>
}

export default OwnerOperatorServiceCostsForm;