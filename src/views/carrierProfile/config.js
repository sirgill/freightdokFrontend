import {getCheckStatusIcon} from "../../utils/utils";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import {UPDATE_INTEGRATIONS_LINK} from "../../components/constants";

export const integrationCredentialConfig = ({path}) => ({
    rowCellPadding: 'normal',
    showRefresh: false,
    columns: [
        {
            id: 'integrationName',
            label: 'Integrations'
        },
        {
            id: 'key',
            label: 'Key/Code'
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
            renderer: ({}) => {
                return <Button component={Link} to={path + UPDATE_INTEGRATIONS_LINK} variant='contained'>Update</Button>
            }
        }
    ]
})

export const tableConfig = {
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

export const modalConfig = {
    title: 'Update Integration Details',
    preventBackdropClick: true
}