import React, { useEffect } from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getCarrierProfile } from "../../actions/carrierProfile.action";
import { withRouter, useRouteMatch, Link } from 'react-router-dom'
import { getCheckStatusIcon, getUserDetail } from "../../utils/utils";
import { Stack, Button, IconButton } from "@mui/material";
import UpdateCarrierProfile from "./UpdateCarrierProfile";
import { PRIMARY_BLUE, successIconColor } from "../../components/layout/ui/Theme";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachmentIcon from '@mui/icons-material/Attachment';

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

    const tableConfig = {
        rowCellPadding: 'normal',
        showRefresh: true,
        columns: [
            {
                id: 'companyName',
                label: 'Company Name'
            },
            {
                id: 'ein',
                label: 'EIN#'
            },
            {
                id: 'dotNumber',
                label: 'DOT#'
            },
            {
                id: 'operatingStatus',
                label: 'Operating Status',
                renderer: ({ row = {} }) => {
                    const { operatingStatus } = row;
                    return getCheckStatusIcon(operatingStatus === 'Y')
                }
            },
        ]
    }
    return (
        <>
            <EnhancedTable data={data} loading={loading} config={tableConfig} onRefetch={() => dispatch(getCarrierProfile())} />
            {isMatch && <UpdateCarrierProfile onCloseUrl={path} />}
            {role !== 'admin' && <Button variant='contained' component={Link} to={path + '/updateCarrierProfile'}
                sx={{ position: 'absolute', right: 10, "&.MuiButton-contained:hover": { color: '#fff' } }}>Update Profile</Button>}
        </>
    )
}

export default withRouter(CarrierProfile);
