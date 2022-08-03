import React, {Fragment, useState, useEffect} from "react";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LoadsWithStatus from "./LoadsWithStatus.js";
import {makeStyles} from "@material-ui/core/styles";
import {resetLoadsSearch} from "../../actions/load.js";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../layout/Spinner";
import {getLoads, searchLoads, selectLoad} from "../../actions/load";
import EnhancedTable from "../Atoms/table/Table";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import {errorIconColor, successIconColor} from "../layout/ui/Theme";
import LoadDetailModal from "./LoadDetailModal";
import {getParsedLoadEquipment} from "../../views/openBoard/constants";
import moment from "moment";

const useStyles = makeStyles({
    TableContainer: {
        borderBottom: "none",
    },
    loadSearchbar: {
        textAlign: "right",
        paddingBottom: 10,
    },
});

export default function LoadsStatus({resetSearchField, listBarType}) {
    const classes = useStyles();
    const dispatch = useDispatch(),
        {loads = [], loads_pagination: {limit = 15, total, currPage} = {}, rowsPerPage = 15,
            search: { query, loads: sLoads, page: sPage, limit:sLimit, total: sTotal } = {}} = useSelector(state => state.load),
        [modal, setModal] = useState({open: false, data: {}});
    // const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getLoads())
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        resetSearchField();
        dispatch(resetLoadsSearch(listBarType));
        return () => {
            resetSearchField();
            dispatch(resetLoadsSearch(listBarType));
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        if (query)
            dispatch(searchLoads(newPage-1, limit, query, listBarType));
        else
            dispatch(getLoads(newPage-1, rowsPerPage, listBarType));
    };

    const tableConfig = {
        onPageChange: handleChangePage,
        rowCellPadding: 'inherit',
        page: parseInt(currPage)-1,
        count: total,
        limit,
        hover: true,
        onRowClick: (row) => {
            if (listBarType === 'history') {
                setModal({open: true, data: row})
            }
        },
        columns: [
            {
                id: 'loadNumber',
                label: 'Load Number'
            },

            {
                id: 'pickupCity',
                label: 'Pickup City/State',
                renderer: ({row: {pickup = []} = {}}) => {
                    const [pickupData = {}] = pickup,
                        {pickupCity = ''} = pickupData;
                    return <span>{pickupCity}</span>
                }
            },
            {
                id: "pickupDate",
                label: "Pickup Date",
                renderer: ({row}) => {
                    let date = "";
                    if (moment(row.pickUpByDate).isValid()) {
                        date = moment(row.pickUpByDate).format("M/DD/YYYY");
                    }
                    return <Fragment>{date}</Fragment>;
                },
            },
            {
                id: 'dropCity',
                label: 'Drop City/State',
                renderer: ({row: {drop = []} = {}}) => {
                    const [dropData = {}] = drop,
                        {dropCity = ''} = dropData;
                    // console.log('row for pickup city', row)
                    return <span>{dropCity}</span>
                }
            },

            {
                id: "deliveryDate",
                label: "Delivery Date",
                renderer: ({row}) => {
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
                renderer: ({row}) => {
                    const {modesString = '', standard = ''} = getParsedLoadEquipment(row)
                    return (
                        <Fragment>
                            {modesString} {standard}
                        </Fragment>
                    );
                },
            },

            {
                id: "company",
                label: "Company",
                renderer: () => {
                    return"C.H Robinson"
                },
            },
            {
                id: 'rate',
                label: 'Rate',
                emptyState: '--'
            },

        ]
    }
    return (
        <div className={classes.table}>
            {/*{loading ? (*/}
            {/*    <Spinner/>*/}
            {/*) : (*/}
                <Fragment>
                    <EnhancedTable config={tableConfig} data={loads} loading={loading}/>
                    {modal.open && <LoadDetailModal
                        listBarType={listBarType}
                        modalEdit={true}
                        open={true}
                        load={modal.data}
                        handleClose={() => {
                            setModal({open: false, data: {}});
                            // enableEdit(false);
                            selectLoad();
                        }}
                    />}
                    {/*<TableContainer component={Paper} className={classes.TableContainer}>*/}
                    {/*    <Table borderBottom="none" aria-label="caption table">*/}
                    {/*        <TableHead className={classes.TableContainer}>*/}
                    {/*            <TableRow>*/}
                    {/*                /!* <TableCell align="center"></TableCell> *!/*/}
                    {/*                <TableCell align="center">Load #</TableCell>*/}
                    {/*                <TableCell align="center">Status</TableCell>*/}
                    {/*                <TableCell align="center">Pick</TableCell>*/}
                    {/*                <TableCell align="center">Drop</TableCell>*/}
                    {/*                <TableCell align="center">Rate Confirmation</TableCell>*/}
                    {/*                <TableCell align="center">Proof of delivery</TableCell>*/}
                    {/*                <TableCell align="center">Accessorials</TableCell>*/}
                    {/*                /!* <TableCell align="center" /> *!/*/}
                    {/*            </TableRow>*/}
                    {/*        </TableHead>*/}
                    {/*        <LoadsWithStatus listBarType={listBarType}/>*/}
                    {/*    </Table>*/}
                    {/*</TableContainer>*/}
                </Fragment>
            {/*)}*/}
        </div>
    );
}
