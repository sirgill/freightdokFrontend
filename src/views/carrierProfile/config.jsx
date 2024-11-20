import {getCheckStatusIcon, getActiveInactiveStatus} from "../../utils/utils";
import {Button, IconButton} from "@mui/material";
import {Link} from "react-router-dom";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {UPDATE_INTEGRATIONS_LINK} from "../../components/constants";
import React from "react";
import {UserSettings} from "../../components/Atoms/client";
import {FACTORING_PARTNERS} from "../../components/client/routes";

export const integrationNameMap = {chRobinson: 'C.H. Robinson', newtrul: 'New Trul'};

const {edit} = UserSettings.getUserPermissionsByDashboardId('carrierProfile');

export const integrationCredentialConfig = ({path, _dbData, list, refetch}) => ({
    rowCellPadding: 'normal',
    showRefresh: false,
    columns: [
        {
            id: 'integrationName',
            label: 'Integrations',
            valueFormatter: (value) => integrationNameMap[value] || value,
        },
        {
            id: 'code',
            label: 'Key/Code',
            renderer:({row}) => {
                return row.code ? '******' : row.clientSecret ? '******' : '--'
            }
        },
        {
            id: 'email',
            label: 'Email'
        },
        {
            id: 'mc',
            label: 'MC#',
        },
        {
            renderer: ({row}, rowIndex) => {
                return <Button
                    disabled={!edit}
                    component={Link}
                    to={{pathname: path + UPDATE_INTEGRATIONS_LINK, state: {row, rowIndex, _dbData, list, refetch}}}
                    variant='contained'
                >
                    Update
                </Button>
            }
        }
    ]
})

export const tableConfig = {
    containerHeight: 'auto',
    rowCellPadding: 'normal',
    showRefresh: true,
    columns: [
        {
            id: 'name',
            label: 'Company Name'
        },
        {
            id: 'otherOrgMetaData.carrier.ein',
            label: 'EIN#'
        },
        {
            id: 'otherOrgMetaData.carrier.dotNumber',
            label: 'DOT#',
            emptyState: '--'
        },
        {
            id: 'operatingStatus',
            label: 'Operating Status',
            renderer: ({row = {}}) => {
                const {otherOrgMetaData: {carrier: {allowedToOperate} ={}} = {}} = row;
                return getCheckStatusIcon(allowedToOperate === 'Y')
            }
        },
    ]
}

export const factoringPartnersTableConfig = ({path}) => {
    return {
        rowCellPadding: 'normal',
        showRefresh: true,
        columns: [
            {
                id: 'name',
                label: 'Partner Name'
            },
            {
                id: 'host',
                label: 'Host'
            },
            {
                id: 'email',
                label: 'Email'
            },
            {
                id: 'password',
                label: 'Password',
                valueFormatter: () => '******'
            },
            {
                id: 'port',
                label: 'Port'
            },
            {
                id: 'noticeText',
                label: 'Notice Text'
            },
            {
                id: 'lastUpdatedBy.name',
                label: 'Last Updated By',
            },
            {
                id: 'status',
                label: 'Status',
                renderer: ({row}) => {
                    return getActiveInactiveStatus(row.status)
                }
            },
            {
                id: 'actions',
                renderer: ({row}) => {
                    return <IconButton color='primary' component={Link} to={path + FACTORING_PARTNERS + `/${row._id}`}>
                        <EditOutlinedIcon />
                    </IconButton>
                }
            }
        ]
    }
}

export const modalConfig = {
    title: 'Update Integration Details',
    preventBackdropClick: true,
    titleStyles: {
        // p: 1
    }
}