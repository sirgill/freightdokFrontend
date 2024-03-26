import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { resetLoadsSearch } from "../../actions/load.js";
import { useDispatch, useSelector } from "react-redux";
import { getLoads, searchLoads, selectLoad } from "../../actions/load";
import EnhancedTable from "../Atoms/table/Table";
import LoadDetailModal from "./LoadDetailModal";
import { getParsedLoadEquipment } from "../../views/openBoard/constants";
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

export default function LoadsStatus({ resetSearchField, listBarType }) {
    const classes = useStyles();
    const dispatch = useDispatch(),
        { loads = [], loads_pagination: { limit = 15, total, currPage } = {}, rowsPerPage = 15,
            search: { query, loads: sLoads, page: sPage, limit: sLimit, total: sTotal } = {} } = useSelector(state => state.load),
        [modal, setModal] = useState({ open: false, data: {} });
    // const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getLoads())
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        resetSearchField && resetSearchField();
        dispatch(resetLoadsSearch(listBarType));
        return () => {
            resetSearchField && resetSearchField();
            dispatch(resetLoadsSearch(listBarType));
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        if (query)
            dispatch(searchLoads(newPage - 1, limit, query, listBarType));
        else
            dispatch(getLoads(newPage - 1, rowsPerPage, listBarType));
    };

    const tableConfig = {
        onPageChange: handleChangePage,
        rowCellPadding: 'inherit',
        page: parseInt(currPage) - 1,
        count: total,
        limit,
        hover: true,
        onRowClick: (row) => {
            if (listBarType === 'history') {
                setModal({ open: true, data: row })
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
                renderer: ({ row: { pickup = [] } = {} }) => {
                    const [pickupData = {}] = pickup,
                        { pickupCity = '' } = pickupData;
                    return pickupCity;
                }
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
                id: 'dropCity',
                label: 'Drop City/State',
                renderer: ({ row: { drop = [] } = {} }) => {
                    const [dropData = {}] = drop,
                        { dropCity = '' } = dropData;
                    // console.log('row for pickup city', row)
                    return dropCity
                }
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
                    const { modesString = '', standard = '' } = getParsedLoadEquipment(row)
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
                    return "C.H Robinson"
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
        <div>
            <Fragment>
                <EnhancedTable config={tableConfig} data={loads} loading={loading} />
                {modal.open && <LoadDetailModal
                    listBarType={listBarType}
                    modalEdit={true}
                    open={true}
                    load={modal.data}
                    handleClose={() => {
                        setModal({ open: false, data: {} });
                        // enableEdit(false);
                        selectLoad();
                    }}
                />}
            </Fragment>
            {/*)}*/}
        </div>
    );
}
