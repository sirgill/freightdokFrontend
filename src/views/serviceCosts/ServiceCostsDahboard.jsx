import {useCallback, useEffect, useMemo, useState} from "react";
import {Route} from "react-router-dom";
import {Box} from "@mui/material";
import Widget from "../../layout/Widget";
import EnhancedTable from "../../components/Atoms/table/Table";
import {efsTransactionRatesTableConfig, ownerOperatorTableConfig} from "./config";
import useFetch from "../../hooks/useFetch";
import {GET_SERVICE_COSTS_EFS_TRANSACTION, GET_SERVICE_COSTS_OWNER_OPERATOR} from "../../config/requestEndpoints";
import {Input, LoadingButton} from "../../components/Atoms";
import EfsTransactionCostForm from "./EfsTransactionCostForm";
import {addEvent, removeEvent} from "../../utils/utils";

const ServiceCostsDashboard = (props) => {
    const {match: {path} = {}} = props;
    const {data={}, loading, refetch, isRefetching} = useFetch(GET_SERVICE_COSTS_OWNER_OPERATOR);
    const {data: efsData={}, loading: isEfsLoading, refetch: efsRefetch, isRefetching: isEfsRefetching} = useFetch(GET_SERVICE_COSTS_EFS_TRANSACTION);
    const [input, setInput] = useState('')

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(input)
    }, [input])

    const actions = useMemo(() => {
        return <Box sx={{display: 'flex', gap: 1}} component='form' onSubmit={onSubmit}>
            <Input label='Add Category' value={input} onChange={({value}) => setInput(value)} />
            <LoadingButton type='submit' isLoading={false}>Add</LoadingButton>
        </Box>
    }, [input, onSubmit])

    useEffect(() => {
        addEvent(window, 'refetchEfsTransactionCosts', efsRefetch);

        return () => {
            removeEvent(window, 'refetchEfsTransactionCosts', efsRefetch);
        }
    }, [efsRefetch]);

    return <Box sx={{height: '100%'}}>
        <Widget title='Owner Operator Costs' sx={{mt: 2}}>
            <EnhancedTable
                data={data.data}
                config={ownerOperatorTableConfig({path})}
                onRefetch={refetch}
                loading={loading}
                actions={actions}
                isRefetching={isRefetching}
            />
        </Widget>
        <Widget title='EFS Transaction Costs' sx={{mt: 2}}>
            <EnhancedTable
                data={efsData.data}
                config={efsTransactionRatesTableConfig({path})}
                isRefetching={isEfsRefetching}
                onRefetch={efsRefetch}
                loading={isEfsLoading}
            />
        </Widget>
        <Route path={path+'/efs/:id'} component={EfsTransactionCostForm} />
    </Box>
}

export default ServiceCostsDashboard;