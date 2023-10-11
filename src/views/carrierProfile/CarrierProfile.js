import React, { useEffect } from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getCarrierProfile } from "../../actions/carrierProfile.action";
import {withRouter, useRouteMatch, Link, Route} from 'react-router-dom'
import { getUserDetail } from "../../utils/utils";
import {Stack, Button, IconButton, Box} from "@mui/material";
import UpdateCarrierProfile from "./UpdateCarrierProfile";
import { PRIMARY_BLUE, successIconColor } from "../../components/layout/ui/Theme";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachmentIcon from '@mui/icons-material/Attachment';
import {integrationCredentialConfig, tableConfig} from "./config";
import IntegrationsForm from "./IntegrationsForm";
import {UPDATE_INTEGRATIONS_LINK} from "../../components/constants";

const CarrierProfile = ({ match = {} }) => {
    const { path } = match,
        isMatch = useRouteMatch(path + '/updateCarrierProfile'),
        { role = 'admin' } = getUserDetail().user || {};
    const { data, loading } = useSelector(state => state.carrierProfile);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCarrierProfile());
    }, [dispatch])

    const Attachment = ({ url }) => (<Stack direction='row' alignItems='center'>
        <CheckCircleIcon style={{ color: successIconColor }} />
        <IconButton onClick={() => window.open(url)}>
            <AttachmentIcon style={{ color: PRIMARY_BLUE, fontSize: 30 }} />
        </IconButton>
    </Stack>)


    // Test Data
    const CREDS = [
        {
            integrationName: 'C.H Robinson', key: '3432432', email: 'test@gmail.com', mc: '342349090'
        }
    ]

    return (
        <>
            <EnhancedTable data={data} loading={loading} config={tableConfig} onRefetch={() => dispatch(getCarrierProfile())} />
            {isMatch && <UpdateCarrierProfile onCloseUrl={path} />}
            {role !== 'admin' && <Button variant='contained' component={Link} to={path + '/updateCarrierProfile'}
                sx={{ position: 'absolute', right: 10, "&.MuiButton-contained:hover": { color: '#fff' } }}>Update Profile</Button>}
            <Box sx={{mt: 2}}>
                <EnhancedTable data={CREDS} loading={false} config={integrationCredentialConfig({path})} />
            </Box>
            <Route component={IntegrationsForm} path={path + UPDATE_INTEGRATIONS_LINK} />
        </>
    )
}

export default withRouter(CarrierProfile);
