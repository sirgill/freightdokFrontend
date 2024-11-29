import React, {useEffect} from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";
import {useDispatch, useSelector} from "react-redux";
import {getCarrierProfile} from "../../actions/carrierProfile.action";
import {withRouter, useRouteMatch, Route} from 'react-router-dom'
import {addEvent, getUserDetail, removeEvent} from "../../utils/utils";
import {Box, Typography, Paper} from "@mui/material";
import UpdateCarrierProfile from "./UpdateCarrierProfile";
import {factoringPartnersTableConfig, integrationCredentialConfig, tableConfig} from "./config";
import IntegrationsForm from "./IntegrationsForm";
import {UPDATE_FACTORING_PARTNERS, UPDATE_INTEGRATIONS_LINK} from "../../components/constants";
import useFetch from "../../hooks/useFetch";
import {GET_FACTORING_PARTNERS, GET_SECRETS_MANAGER} from "../../config/requestEndpoints";
import FactoringPartnersForm from "./factoringPartners/FactoringPartnersForm";
import useEnhancedFetch from "../../hooks/useEnhancedFetch";
import {UserSettings} from "../../components/Atoms/client";

const {viewFactoringPartners, updateFactoringPartners} = UserSettings.getUserPermissionsByDashboardId('carrierProfile');

const CarrierProfile = ({match = {}}) => {
    const {path} = match,
        isMatch = useRouteMatch(path + '/updateCarrierProfile');
    const {data, loading} = useSelector(state => state.carrierProfile);
    const dispatch = useDispatch();
    const {data: integrationsData = {}, loading: integrationsLoading, refetch, isRefetching} = useFetch(GET_SECRETS_MANAGER, null, {
        queryParams: {
            orgId: getUserDetail().user.orgId
        },
    });
    const {loading: loadingFactoringPartners, data: factoringPartnersData,
        isRefetching: refectingFactoringPartners, refetch: refetchFP} = useEnhancedFetch(GET_FACTORING_PARTNERS, )
    const {data: integrationsList, _dbData} = integrationsData || {};

    useEffect(() => {
        dispatch(getCarrierProfile());
        addEvent(window, 'fetchCarrierProfile', refetch)

        return () => removeEvent(window, 'fetchCarrierProfile', refetch)
    }, [dispatch])


    return (
        <Box sx={{height: '100%', overflow: 'auto'}} className='dashboardRoot'>
            <EnhancedTable data={data} loading={loading} config={tableConfig} onRefetch={refetch}
                           isRefetching={isRefetching}/>
            {isMatch && <UpdateCarrierProfile onCloseUrl={path}/>}
            <Box sx={{mt: 4}}>
                <EnhancedTable data={integrationsList} loading={integrationsLoading}
                               config={integrationCredentialConfig({path, data: _dbData, list: integrationsList})}/>
            </Box>
            {viewFactoringPartners && <Paper
                variant='outlined'
                sx={{
                    mt: 4,
                    background: '#fff',
                    p: 2,
                    '.enhanced-table': {
                        '.tableContainer': {
                            boxShadow: 'none',
                            border: '1px solid #e5e5e5'
                        }
                    }
                }}
            >
                <Typography variant='h6' fontWeight='bold'>Factoring Partners</Typography>
                <EnhancedTable
                    config={factoringPartnersTableConfig({path, updateFactoringPartners})}
                    data={factoringPartnersData?.data}
                    loading={loadingFactoringPartners}
                    isRefetching={refectingFactoringPartners}
                    onRefetch={refetchFP}
                />
            </Paper>}
            <Route component={IntegrationsForm} path={path + UPDATE_INTEGRATIONS_LINK}/>
            <Route render={(props) => <FactoringPartnersForm {...props} refetch={refetchFP} onCloseUrl={path} />} path={path + UPDATE_FACTORING_PARTNERS}/>
        </Box>
    )
}

export default withRouter(CarrierProfile);
