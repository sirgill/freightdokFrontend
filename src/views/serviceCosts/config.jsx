import {getDollarPrefixedPrice} from "../../utils/utils";
import {IconButton} from "@mui/material";
import {Link} from "react-router-dom";
import {EFS_TRANSACTION_COSTS, SERVICE_COSTS} from "../../components/client/routes";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React from "react";

export const ownerOperatorTableConfig = ({path, editOpCosts}) => ({
    showRefresh: true,
    rowCellPadding: 'normal',
    columnsBuilder: ({data, columns}) => {
        let index = 6
        data.forEach((col) => {
            const {additionalCosts} = col;
            for(let key in additionalCosts){
                const idx = columns.findIndex(item => {
                    return item.id === key;
                })
                if(idx < 0){
                    columns.splice(index, 0, {
                        id: key,
                        label: key,
                        valueFormatter: (value, row) => getDollarPrefixedPrice(row.additionalCosts[key])
                    })
                    index++;
                }
            }
        })
        return columns;
    },
    columns: [
        {
            id: 'ownerOperatorId.name',
            label: 'Owner Operator'
        },
        {
            id: 'lease',
            label: 'Lease (%)',
            valueFormatter: (value) => value + '%'
        },
        {
            id: 'truckInsurance',
            label: 'Truck Insurance',
            valueFormatter: (value) => getDollarPrefixedPrice(value)
        },
        {
            id: 'trailerInsurance',
            label: 'Trailer Insurance',
            valueFormatter: (value) => getDollarPrefixedPrice(value)
        },
        {
            id: 'eld',
            label: 'ELD',
            valueFormatter: (value) => getDollarPrefixedPrice(value)
        },
        {
            id: 'parking',
            label: 'Parking',
            valueFormatter: (value) => getDollarPrefixedPrice(value)
        },
        {
            id: 'total',
            label: 'Total',
            valueFormatter: (value) => getDollarPrefixedPrice(value)
        },
        {
            id: 'actions',
            visible: editOpCosts,
            renderer: ({row}) => {
                return <IconButton color='primary' component={Link} to={path + SERVICE_COSTS + `/${row._id}`}>
                    <EditOutlinedIcon />
                    </IconButton>
            }
        },
    ]
})

export const efsTransactionRatesTableConfig = ({path, editEfsTransactionRates}) => {
   return {
       showRefresh: true,
       rowCellPadding: 'normal',
       columns: [
           {
               id: 'AmountRange',
               label: 'Amount Range',
               renderer: ({row}) => {
                   const {maxAmount, minAmount} = row || {};
                   return `$${minAmount}-${maxAmount}`
               }
           },
           {
               id: 'transactionCost',
               label: 'Transaction Cost',
               valueFormatter: value => getDollarPrefixedPrice(value)
           },
           {
               id: 'actions',
               visible: editEfsTransactionRates,
               renderer: ({row}) => {
                   return <IconButton color='primary' component={Link} to={path + EFS_TRANSACTION_COSTS + `/${row._id}`}>
                       <EditOutlinedIcon />
                   </IconButton>
               }
           },
       ]
   }
}