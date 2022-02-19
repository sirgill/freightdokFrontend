import React, {useState, useEffect, Fragment} from 'react';
import Button from '@mui/material/Button';
import TablePagination from '@material-ui/core/TablePagination';
import {makeStyles} from '@material-ui/core/styles';
import {resetLoadsSearch} from '../../actions/load.js';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from "../layout/Spinner";
import Invoices from './Invoices.js';
import {getInvoiceLoads} from "../../actions/load";
import EnhancedTable from "../Atoms/table/Table";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import LoadDetailModal from "../loads/LoadDetailModal";
import InvoiceEditItem from "./InvoiceEditItem";
import {errorIconColor, successIconColor} from "../layout/ui/Theme";
import {Link, Route} from "react-router-dom";
import Invoice from "./NewInvoice";

const useStyles = makeStyles({
    TableContainer: {
        borderBottom: "none"
    },
    loadSearchbar: {
        textAlign: 'right',
        paddingBottom: 10
    },
});

export default function InvoicesList({setSelectedLoad, resetSearchField, listBarType, load_selected}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const {page, limit, total} = useSelector(state => state.load.invoices);
    const invoices = useSelector(state => state.load.invoices.data);
    const [modalEdit, enableEdit] = useState(false);
    const [open, setOpen] = useState({show: false, data: {}});
    const loads = useSelector(state => state.load.loads);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        resetSearchField();
        dispatch(resetLoadsSearch(listBarType));
        dispatch(getInvoiceLoads());
        return () => {
            resetSearchField();
            dispatch(resetLoadsSearch(listBarType));
        }
    }, []);

    useEffect(() => {
        dispatch(getInvoiceLoads());
    }, [loads]);

    const handleChangePage = (event, newPage) => {
        dispatch(getInvoiceLoads(newPage, limit));
    };
    const handleChangeRowsPerPage = (event) => {
        const limit = event.target.value;
        dispatch(getInvoiceLoads(0, limit));
    };

    const config = {
        rowCellPadding: 'none',
        headerCellSx:{pt:1, pb:1},
        page,
        count: total,
        limit,
        columns: [
            {
                id: 'loadNumber',
                label: 'Load #'
            },
            {
                id: 'brokerage',
                label: 'Broker'
            },
            {
                id: 'rate',
                label: 'Rate Amount',
                renderer: ({row: {rate = ''}}) => rate || '--'
            },
            {
                id: 'rateConfirmation',
                label: 'Rate Con',
                renderer: ({row}) => {
                    return Array.isArray(row.rateConfirmation) && row.rateConfirmation.length > 0 && typeof row.rateConfirmation[0] !== 'string' ?
                        <CheckCircleIcon style={{color: successIconColor}}/>
                        : <CancelIcon style={{color: errorIconColor}}/>
                }
            },
            {
                id: 'loadNumber',
                label: 'POD',
                renderer: ({row: {proofDelivery = []}}) => {
                    return Array.isArray(proofDelivery) && proofDelivery.length > 0 && typeof proofDelivery[0] !== 'string' ?
                        <CheckCircleIcon style={{color: successIconColor}}/>
                        : <CancelIcon style={{color: errorIconColor}}/>
                }
            },
            {
                id: 'edit',
                label: 'Edit',
                renderer: ({row}) => {
                    return <InvoiceEditItem invoice={row} />
                }
            },
            {
                id: '',
                label: 'Invoice',
                renderer: ({row}) => {
                    return <Button
                        component={Link}
                        to={'/dashboard/invoice/' + row._id}
                        variant="outlined"
                        color="primary"
                    >
                        Create Invoice
                    </Button>
                }
            },
        ]
    }

    return (
        <div className={classes.table}>
            {/*{loading ? <Spinner/> : (*/}
                <Fragment>
                    <EnhancedTable loading={loading} config={config} data={invoices}/>
                    <Route path={'/dashboard/invoice/:id'} component={Invoice} />
                    {/*<TablePagination*/}
                    {/*    rowsPerPageOptions={[5, 10, 15]}*/}
                    {/*    colSpan={3}*/}
                    {/*    count={+total}*/}
                    {/*    rowsPerPage={+limit}*/}
                    {/*    page={+page}*/}
                    {/*    SelectProps={{*/}
                    {/*        inputProps: {'aria-label': 'rows per page'},*/}
                    {/*        native: false,*/}
                    {/*    }}*/}
                    {/*    onChangePage={handleChangePage}*/}
                    {/*    onChangeRowsPerPage={handleChangeRowsPerPage}*/}
                    {/*/>*/}

                    {/*<LoadDetailModal*/}
                    {/*    modalEdit={true}*/}
                    {/*    open={!!open.show}*/}
                    {/*    load={open?.data}*/}
                    {/*    handleClose={() => {*/}
                    {/*        setOpen(false);*/}
                    {/*        enableEdit(false);*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Fragment>
            {/*// )}*/}
        </div>
    )
}