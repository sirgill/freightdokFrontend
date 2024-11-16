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
import {GET_SECRETS_MANAGER} from "../../config/requestEndpoints";
import FactoringPartnersForm from "./factoringPartners/FactoringPartnersForm";

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
    const {data: integrationsList, _dbData} = integrationsData || {};

    useEffect(() => {
        dispatch(getCarrierProfile());
        addEvent(window, 'fetchCarrierProfile', refetch)

        return () => removeEvent(window, 'fetchCarrierProfile', refetch)
    }, [dispatch])


    return (
        <Box sx={{height: '100%', overflow: 'auto'}}>
            <EnhancedTable data={data} loading={loading} config={tableConfig} onRefetch={refetch}
                           isRefetching={isRefetching}/>
            {isMatch && <UpdateCarrierProfile onCloseUrl={path}/>}
            {/*{role !== 'admin' && <Box sx={{display :'flex', justifyContent: 'flex-end'}}>*/}
            {/*    <Button variant='contained' component={Link} to={path + '/updateCarrierProfile'}>Update Profile</Button>*/}
            {/*</Box>}*/}
            <Box sx={{mt: 4}}>
                <EnhancedTable data={integrationsList} loading={integrationsLoading}
                               config={integrationCredentialConfig({path, data: _dbData, list: integrationsList})}/>
            </Box>
            <Paper
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
                    config={factoringPartnersTableConfig({path})}
                    data={[]}
                />
            </Paper>
            <Route component={IntegrationsForm} path={path + UPDATE_INTEGRATIONS_LINK}/>
            <Route component={FactoringPartnersForm} path={path + UPDATE_FACTORING_PARTNERS}/>
        </Box>
    )
}

export default withRouter(CarrierProfile);
