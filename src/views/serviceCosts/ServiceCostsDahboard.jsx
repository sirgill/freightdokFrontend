import {useCallback, useEffect, useMemo, useState} from "react";
import {Link, Route} from "react-router-dom";
import {Box, Button} from "@mui/material";
import Widget from "../../layout/Widget";
import EnhancedTable from "../../components/Atoms/table/Table";
import {efsTransactionRatesTableConfig, ownerOperatorTableConfig} from "./config";
import useFetch from "../../hooks/useFetch";
import {GET_SERVICE_COSTS_EFS_TRANSACTION, GET_SERVICE_COSTS_OWNER_OPERATOR} from "../../config/requestEndpoints";
import {Input, LoadingButton} from "../../components/Atoms";
import EfsTransactionCostForm from "./EfsTransactionCostForm";
import {addEvent, removeEvent} from "../../utils/utils";
import {UserSettings} from "../../components/Atoms/client";

const ServiceCostsDashboard = (props) => {
    const {viewEfsTransactionRates, editEfsTransactionRates, addEfsTransactionRates, viewOpCosts, addOpCosts, editOpCosts} = UserSettings.getUserPermissionsByDashboardId('serviceCosts');
    const {match: {path} = {}} = props;
    const {data={}, loading, refetch, isRefetching} = useFetch(GET_SERVICE_COSTS_OWNER_OPERATOR);
    const {data: efsData={}, loading: isEfsLoading, refetch: efsRefetch, isRefetching: isEfsRefetching} = useFetch(GET_SERVICE_COSTS_EFS_TRANSACTION);
    const [input, setInput] = useState('')

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(input)
    }, [input])

    const actions = useMemo(() => {
        return addOpCosts && <Box sx={{display: 'flex', gap: 1}} component='form' onSubmit={onSubmit}>
            <Input label='Add Category' value={input} onChange={({value}) => setInput(value)} />
            <LoadingButton type='submit' isLoading={false}>Add</LoadingButton>
        </Box>
    }, [input, onSubmit, addOpCosts]);

    const EfsActions = useMemo(() => {
        return addEfsTransactionRates && <Button component={Link} to={path + `/efs/new`} variant='outlined'>Add</Button>
    }, [addEfsTransactionRates, path])

    useEffect(() => {
        addEvent(window, 'refetchEfsTransactionCosts', efsRefetch);

        return () => {
            removeEvent(window, 'refetchEfsTransactionCosts', efsRefetch);
        }
    }, [efsRefetch]);

    return <Box sx={{height: '100%'}}>
        {viewOpCosts && <Widget title='Owner Operator Costs' sx={{mt: 2}}>
            <EnhancedTable
                data={data.data}
                config={ownerOperatorTableConfig({path, editOpCosts})}
                onRefetch={refetch}
                loading={loading}
                actions={actions}
                isRefetching={isRefetching}
            />
        </Widget>}
        {viewEfsTransactionRates && <Widget title='EFS Transaction Costs' sx={{mt: 2}}>
            <EnhancedTable
                data={efsData.data}
                config={efsTransactionRatesTableConfig({path, editEfsTransactionRates})}
                isRefetching={isEfsRefetching}
                onRefetch={efsRefetch}
                loading={isEfsLoading}
                actions={EfsActions}
            />
        </Widget>}
        <Route path={path+'/efs/:id'} component={EfsTransactionCostForm} />
    </Box>
}

export default ServiceCostsDashboard;