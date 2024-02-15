import React, { useEffect } from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getCarrierProfile } from "../../actions/carrierProfile.action";
import {withRouter, useRouteMatch, Route} from 'react-router-dom'
import {addEvent, getUserDetail, removeEvent} from "../../utils/utils";
import {Box} from "@mui/material";
import UpdateCarrierProfile from "./UpdateCarrierProfile";
import {integrationCredentialConfig, tableConfig} from "./config";
import IntegrationsForm from "./IntegrationsForm";
import {UPDATE_INTEGRATIONS_LINK} from "../../components/constants";
import useFetch from "../../hooks/useFetch";
import {GET_SECRETS_MANAGER} from "../../config/requestEndpoints";

const CarrierProfile = ({ match = {} }) => {
    const { path } = match,
        isMatch = useRouteMatch(path + '/updateCarrierProfile');
    const { data, loading } = useSelector(state => state.carrierProfile);
    const dispatch = useDispatch();
    const {data: integrationsData = {}, loading: integrationsLoading, refetch, isRefetching} = useFetch(GET_SECRETS_MANAGER, null, {
        queryParams: {
            orgId: getUserDetail().user.orgId
        },
    });
    const {data: integrationsList, _dbData} = integrationsData || {};

    useEffect(() => {
        dispatch(getCarrierProfile());
        addEvent(window, 'fetchCarrierProfile', refetch)

        return () => removeEvent(window, 'fetchCarrierProfile', refetch)
    }, [])


    return (
        <>
            <EnhancedTable data={data} loading={loading} config={tableConfig} onRefetch={refetch} isRefetching={isRefetching} />
            {isMatch && <UpdateCarrierProfile onCloseUrl={path} />}
            {/*{role !== 'admin' && <Box sx={{display :'flex', justifyContent: 'flex-end'}}>*/}
            {/*    <Button variant='contained' component={Link} to={path + '/updateCarrierProfile'}>Update Profile</Button>*/}
            {/*</Box>}*/}
            <Box sx={{mt: 4}}>
                <EnhancedTable data={integrationsList} loading={integrationsLoading} config={integrationCredentialConfig({path, data:_dbData, list: integrationsList})} />
            </Box>
            <Route component={IntegrationsForm} path={path + UPDATE_INTEGRATIONS_LINK} />
        </>
    )
}

export default withRouter(CarrierProfile);
