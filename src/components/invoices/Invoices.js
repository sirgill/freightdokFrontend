import React, { useEffect, useState } from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoiceLoads } from '../../actions/load';
import InvocieEditItem from './InvoiceEditItem';
import { getCheckStatusIcon } from '../../utils/utils';

export default function Invoices({ showWizardFor }) {
    const dispatch = useDispatch();
    const invoices = useSelector(state => state.load.invoices.data);
    const loads = useSelector(state => state.load.loads);

    const [tempInvoices, setTempInvoices] = useState([]);
    const [invoiceToShow, setInvoiceToShow] = useState(null);

    useEffect(() => {
        console.log('Invoices updated :', invoices);
        setTempInvoices(invoices);

        if (invoices && invoiceToShow) {
            const filteredInvoice = invoices.filter((item) => {
                if (item._id === invoiceToShow._id) {
                    return item;
                }
            });

            console.log('Filtered :', filteredInvoice)
            showWizardFor(filteredInvoice[0])
        }
    }, [invoices]);

    const handleShowInvoice = (invoice) => {
        showWizardFor(invoice);
        setInvoiceToShow(invoice)
    }

    useEffect(() => {
        dispatch(getInvoiceLoads());
    }, []);

    useEffect(() => {
        dispatch(getInvoiceLoads());
    }, [loads]);

    return (
        <TableBody>
            {tempInvoices.map((invoice) => (<TableRow>
                <TableCell align="center">{invoice.loadNumber}</TableCell>
                <TableCell align="center">{invoice.brokerage ? invoice.brokerage : '--'}</TableCell>
                <TableCell align="center">{invoice.rate ? invoice.rate : '--'}</TableCell>
                <TableCell align="center">
                    {
                        Array.isArray(invoice.rateConfirmation) && invoice.rateConfirmation.length > 0 && typeof invoice.rateConfirmation[0] !== 'string' ?
                            getCheckStatusIcon(true)
                            : getCheckStatusIcon(false)
                    }
                </TableCell>
                <TableCell align="center">
                    {
                        Array.isArray(invoice.proofDelivery) && invoice.proofDelivery.length > 0 && typeof invoice.proofDelivery[0] !== 'string' ?
                            getCheckStatusIcon(true)
                            : getCheckStatusIcon(false)
                    }
                </TableCell>
                <TableCell align="center">
                    <InvocieEditItem invoice={invoice} />
                </TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShowInvoice(invoice)}>
                        Invoice
                    </Button>
                </TableCell>
            </TableRow>))}
        </TableBody>
    );
}

