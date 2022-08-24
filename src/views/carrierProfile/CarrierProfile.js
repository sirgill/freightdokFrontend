import React, {useEffect, useMemo} from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";
import {useDispatch, useSelector} from "react-redux";
import {getCarrierProfile} from "../../actions/carrierProfile.action";
import {withRouter, useRouteMatch, Link} from 'react-router-dom'
import {getCheckStatusIcon} from "../../utils/utils";
import {Box, Button} from "@mui/material";
import UpdateCarrierProfile from "./UpdateCarrierProfile";

const CarrierProfile = ({ match = {}}) => {
    const {path} = useMemo(() => match, [match]),
        isMatch = useRouteMatch(path + '/updateCarrierProfile');
    const {data, loading} = useSelector(state => state.carrierProfile);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCarrierProfile());
    }, [])

    const tableConfig = {
        rowCellPadding: 'normal',
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
                renderer: ({row = {}}) => {
                    const {operatingStatus} = row;
                    return getCheckStatusIcon(operatingStatus === 'Y')
                }
            },
            {
                id: 'generalLiabilityInsurance',
                label: 'General Liability',
                renderer: ({row}) => {
                    const {url} = row.generalLiabilityInsurance
                    return url ? <span><Box component={'a'} href={url} onClick={() => window.open(url, '_blank')} target='_blank'>Download</Box></span> : '--'
                }
            },
            {
                id: 'autoLiabilityInsurance',
                label: 'Auto Liability',
                renderer: ({row}) => {
                    const {url} = row.autoLiabilityInsurance
                    return url ? <span><Box component={'a'} href={url} target='_blank' onClick={() => window.open(url, '_blank')}>Download</Box> </span> : '--'
                }
            },
            {
                id: 'cargoLiabilityInsurance',
                label: 'Cargo Liability',
                renderer: ({row}) => {
                    const {url} = row.cargoLiabilityInsurance
                    return url ? <Box component={'a'} href={url} target='_blank' onClick={() => window.open(url, '_blank')}>Download</Box> : '--'
                }
            },
        ]
    }
    return (
        <>
            <EnhancedTable data={data} loading={loading} config={tableConfig} />
            {isMatch && <UpdateCarrierProfile onCloseUrl={path} />}
            {<Button variant='contained' component={Link} to={path + '/updateCarrierProfile'}
                                      sx={{position: 'absolute', right: 10, "&.MuiButton-contained:hover": {color: '#fff'}}}>Update Profile</Button>}
        </>
    )
}

export default withRouter(CarrierProfile);