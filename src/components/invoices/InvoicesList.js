import React, { useState, useEffect, Fragment } from 'react';
import Button from '@mui/material/Button';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import { resetLoadsSearch } from '../../actions/load.js';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Spinner from "../layout/Spinner";
import Invoices from './Invoices.js';
import { getInvoiceLoads } from "../../actions/load";
import EnhancedTable from "../Atoms/table/Table";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import InvoiceEditItem from "./InvoiceEditItem";
import { errorIconColor, successIconColor } from "../layout/ui/Theme";
import { Link, Route } from "react-router-dom";
import Invoice from "./NewInvoice";
import { getCHLoads } from "../../actions/openBoard.action";
import moment from "moment";
import { getParsedLoadEquipment } from "../../views/openBoard/constants";

const useStyles = makeStyles({
    TableContainer: {
        borderBottom: "none"
    },
    loadSearchbar: {
        textAlign: 'right',
        paddingBottom: 10
    },
});

export default function InvoicesList({ setSelectedLoad, resetSearchField, listBarType, load_selected }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { page, limit, total } = useSelector(state => state.load.invoices);
    const invoices = useSelector(state => state.load.invoices.data);
    const [modalEdit, enableEdit] = useState(false);
    const [open, setOpen] = useState({ show: false, data: {} });
    const loads = useSelector(state => state.load.loads);
    const { loads: chLoads = [], totalCount } = useSelector(state => state.openBoard.chRobinsonLoads, shallowEqual);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        resetSearchField();
        dispatch(resetLoadsSearch(listBarType));
        dispatch(getInvoiceLoads());
        // dispatch(getCHLoads(true));
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
        rowCellPadding: "inherit",
        headerCellSx: { pt: 1, pb: 1 },
        emptyMessage: 'No Invoices found',
        page,
        count: totalCount,
        limit,
        columns: [
            {
                id: 'loadNumber',
                label: 'Load Number',
            },
            {
                id: "country",
                label: "Pickup City/State",
                renderer: ({ row }) => {
                    return (
                        <Fragment>
                            {row.pickup[0].pickupCity}, {row.pickup[0].pickupState}
                        </Fragment>
                    );
                },
            },
            {
                id: "pickupDate",
                label: "Pickup Date",
                renderer: ({ row }) => {
                    let date = "";
                    if (moment(row.pickUpByDate).isValid()) {
                        date = moment(row.pickUpByDate).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "deliveryCountry",
                label: "Delivery City/State",
                renderer: ({ row }) => {
                    return (
                        <Fragment>
                            {row.drop[0].dropCity}, {row.drop[0].dropState}
                        </Fragment>
                    );
                },
            },
            {
                id: "deliveryDate",
                label: "Delivery Date",
                renderer: ({ row }) => {
                    let date = "";
                    if (moment(row.deliverBy).isValid()) {
                        date = moment(row.deliverBy).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: "equipment",
                label: "Equipment",
                renderer: ({ row }) => {
                    const { modesString = '', standard = '' } = getParsedLoadEquipment(row) || {}
                    return (
                        <Fragment>
                            {modesString} {standard}
                        </Fragment>
                    );
                },
            },
            {
                id: "weight",
                label: "Weight",
                renderer: ({ row }) => {
                    let { weight: { pounds = "" } = {} } = row || {};
                    if (pounds) pounds = pounds + " lbs";
                    return <Fragment>{pounds}</Fragment>;
                },
            },
            {
                id: "company",
                label: "Company",
                renderer: () => {
                    return "C.H Robinson"
                },
            },
            {
                id: 'rate',
                label: 'Rate',
                emptyState: '--'
            },
            {
                id: '',
                label: 'Invoice',
                renderer: ({ row }) => {
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
                <EnhancedTable config={config} data={invoices} />
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