import React, {useMemo, Fragment, useState} from "react";
import './styles.css'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {Button} from "@mui/material";

const InvoiceService = ({serviceName, amount, price, quantity}) => {

    return (
            <Fragment>
                <tr className='invoiceServiceRow'>
                    <td>{serviceName}</td>
                    <td>{quantity}</td>
                    <td>{price}</td>
                    <td>{amount}</td>
                </tr>
            </Fragment>
    )
}

const InvoiceServiceWrapper = ({services}) => {
    console.log('services', services)
    const [open, setOpen] = useState(false);
    const servicesComp = useMemo(() => {
        return services.map(s => {
            return <InvoiceService {...s}/>
        })
    }, [services])

    return (
        <table className='invoiceServiceTable'>
            <tr className='tableHeader'>
                <th>Services</th>
                <th> </th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
            </tr>
            {servicesComp}
            <tr className='addNewItemRow'>
                <td className='addNewItem' onClick={() => setOpen(!open)}>
                    <Button startIcon={<AddCircleOutlineIcon />}>
                        Add new item
                    </Button>
                </td>
            </tr>
        </table>
    )
}

export default InvoiceServiceWrapper;