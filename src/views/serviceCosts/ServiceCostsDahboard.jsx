import {useEffect, useMemo} from "react";
import {Link, Route} from "react-router-dom";
import {Box, Button} from "@mui/material";
import Widget from "../../layout/Widget";
import EnhancedTable from "../../components/Atoms/table/Table";
import {efsTransactionRatesTableConfig, ownerOperatorTableConfig} from "./config";
import useFetch from "../../hooks/useFetch";
import {GET_SERVICE_COSTS_EFS_TRANSACTION, GET_SERVICE_COSTS_OWNER_OPERATOR} from "../../config/requestEndpoints";
import EfsTransactionCostForm from "./EfsTransactionCostForm";
import {addEvent, removeEvent} from "../../utils/utils";
import {UserSettings} from "../../components/Atoms/client";
import AddCategoryComponent from "./OwnerOperatorServiceCosts/AddCategoryComponent";
import OwnerOperatorServiceCostsForm from "./OwnerOperatorServiceCosts/Form";
import {SERVICE_COSTS} from "../../components/client/routes";

const ServiceCostsDashboard = (props) => {
    const {viewEfsTransactionRates, editEfsTransactionRates, addEfsTransactionRates, viewOpCosts, addOpCosts, editOpCosts} = UserSettings.getUserPermissionsByDashboardId('serviceCosts');
    const {match: {path} = {}} = props;
    const {data={}, loading, refetch, isRefetching} = useFetch(GET_SERVICE_COSTS_OWNER_OPERATOR);
    const {data: efsData={}, loading: isEfsLoading, refetch: efsRefetch, isRefetching: isEfsRefetching} = useFetch(GET_SERVICE_COSTS_EFS_TRANSACTION);

    const EfsActions = useMemo(() => {
        return addEfsTransactionRates && <Button component={Link} to={path + `/efs/new`} variant='contained'>Add</Button>
    }, [addEfsTransactionRates, path])

    useEffect(() => {
        addEvent(window, 'refetchEfsTransactionCosts', efsRefetch);
        addEvent(window, 'refetchServiceCosts', refetch);

        return () => {
            removeEvent(window, 'refetchEfsTransactionCosts', efsRefetch);
            removeEvent(window, 'refetchServiceCosts', efsRefetch);
        }
    }, [    ]);

    return <Box sx={{height: '100%'}} className='dashboardRoot'>
        {viewOpCosts && <Widget title='Owner Operator Costs' sx={{mt: 2}}>
            <EnhancedTable
                data={data.data}
                config={ownerOperatorTableConfig({path, editOpCosts})}
                onRefetch={refetch}
                loading={loading}
                actions={<AddCategoryComponent visible={addOpCosts} onRefetch={refetch} data={data.data} />}
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
        <Route path={path+`${SERVICE_COSTS}/:id`} component={OwnerOperatorServiceCostsForm} />
    </Box>
}

export default ServiceCostsDashboard;