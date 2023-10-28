import React, { useEffect } from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getCarrierProfile } from "../../actions/carrierProfile.action";
import {withRouter, useRouteMatch, Link, Route} from 'react-router-dom'
import {addEvent, getUserDetail, removeEvent} from "../../utils/utils";
import {Stack, Button, IconButton, Box} from "@mui/material";
import UpdateCarrierProfile from "./UpdateCarrierProfile";
import { PRIMARY_BLUE, successIconColor } from "../../components/layout/ui/Theme";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachmentIcon from '@mui/icons-material/Attachment';
import {integrationCredentialConfig, tableConfig} from "./config";
import IntegrationsForm from "./IntegrationsForm";
import {UPDATE_INTEGRATIONS_LINK} from "../../components/constants";
import useFetch from "../../hooks/useFetch";

const CarrierProfile = ({ match = {} }) => {
    const { path } = match,
        isMatch = useRouteMatch(path + '/updateCarrierProfile'),
        { role = 'admin', orgId  = '' } = getUserDetail().user || {};
    const { data, loading } = useSelector(state => state.carrierProfile);
    const dispatch = useDispatch();
    const {data: integrationsData = {}, loading: integrationsLoading, refetch} = useFetch('/api/carrierProfile/secret-manager?orgId=' + orgId);
    const {data: integrationsList, _dbData} = integrationsData || {};

    useEffect(() => {
        dispatch(getCarrierProfile());
        addEvent(window, 'fetchCarrierProfile', refetch)

        return () => removeEvent(window, 'fetchCarrierProfile', refetch)
    }, [])

    const Attachment = ({ url }) => (<Stack direction='row' alignItems='center'>
        <CheckCircleIcon style={{ color: successIconColor }} />
        <IconButton onClick={() => window.open(url)}>
            <AttachmentIcon style={{ color: PRIMARY_BLUE, fontSize: 30 }} />
        </IconButton>
    </Stack>)


    return (
        <>
            <EnhancedTable data={data} loading={loading} config={tableConfig} onRefetch={() => dispatch(getCarrierProfile())} />
            {isMatch && <UpdateCarrierProfile onCloseUrl={path} />}
            {role !== 'admin' && <Box sx={{display :'flex', justifyContent: 'flex-end'}}>
                <Button variant='contained' component={Link} to={path + '/updateCarrierProfile'}>Update Profile</Button>
            </Box>}
            <Box sx={{mt: 4}}>
                <EnhancedTable data={integrationsList} loading={integrationsLoading} config={integrationCredentialConfig({path, data:_dbData, list: integrationsList})} />
            </Box>
            <Route component={IntegrationsForm} path={path + UPDATE_INTEGRATIONS_LINK} />
        </>
    )
}

export default withRouter(CarrierProfile);
