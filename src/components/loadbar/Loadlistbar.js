import React, {useEffect, useMemo, useState} from "react";
import moment from 'moment';
import {connect, useDispatch, useSelector} from "react-redux";
import {deleteLoad, getLoads, searchLoads, selectLoad} from "../../actions/load";
import {useStyles} from "../HelperCells.js";
import EnhancedTable from "../Atoms/table/Table";
import LoadDetailModal from "../loads/LoadDetailModal";
import AddLoadForm from "../load-forms/AddLoad";
import {Box} from "@mui/material";
import {ROLES} from "../constants";

const Loadlistbar = ({
                         getLoads,
                         searchLoads,
                         load: {loads, loads_pagination, page, rowsPerPage, search},
                         resetSearchField, searchText
                     }) => {
    const dispatch = useDispatch(),
        classes = useStyles();
    // const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState({open: false, data: {}});
    const {total, currPage} = loads_pagination;
    const [rawLoades, setRawLoads] = useState([]);
    const {auth: {user = {}, roles = []} = {}, driver: {drivers = []} = {}} = useSelector((state) => state),
        {query, loads: sLoads, page: sPage, limit, total: sTotal} = useSelector(state => state.load.search);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        resetSearchField && resetSearchField();
        if (searchText) {
            searchLoads(+page, +limit, search, 'loads');
        } else {
            getLoads(page);
        }
        return () => {
            resetSearchField && resetSearchField();
        };
    }, []);

    useEffect(() => {
        if (user && user.role === "load planner") {
            const filterredLoads = loads.filter((driver) => {
                if (!driver.assignedTo) {
                    return driver;
                }
            });
            setRawLoads(filterredLoads);
        } else if (query) {
            setRawLoads(sLoads)
        } else {
            setRawLoads(loads);
        }

        //Polling for Loads
        const interval = setInterval(() => {
            getLoads(page);
        }, 3000)

        return () => {
            clearInterval(interval);
        }
    }, [loads, sLoads, page]);

    const handleChangePage = (event, newPage) => {
        newPage = newPage - 1
        if (query) searchLoads(newPage, limit, query);
        else getLoads(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const limit = event.target.value;
        if (query) searchLoads(0, limit, query);
        else getLoads(0, limit);
    };

    const onDelete = (id, onDialogClose) => {
        dispatch(deleteLoad(id, (success) => {
            if(success){
                setTimeout(() => getLoads(page), 500)
                onDialogClose();
            }
        }))
    }

    const tableConfig = useMemo(() => ({
        onRowClick: (row) => setOpen({open: true, data: row}),
        rowCellPadding: 'normal',
        count: query ? sTotal : total,
        page: page,
        limit: query ? sPage : rowsPerPage,
        onPageChange: handleChangePage,
        hasDelete: true,
        onDelete,
        deletePermissions: [ROLES.admin, ROLES.ownerOperator, ROLES.superadmin, ROLES.dispatch],
        columns: [
            {
                id: 'loadNumber',
                label: 'Load Number'
            },
            {
                id: 'pickup',
                label: 'PickUp City/State',
                renderer: ({row: {pickup = []} = {}}) => {
                    const [{pickupCity = '', pickupState = ''}] = pickup;
                    return `${pickupCity}, ${pickupState}`;
                }
            },
            {
                id: 'pickupDate',
                label: 'Pickup Date',
                renderer: ({row: {pickup = []} = {}}) => {
                    const [{pickupDate = ''}] = pickup;
                    return moment(pickupDate).format('MM/DD')
                }
            },
            {
                id: 'dropCity',
                label: 'Drop City/State',
                renderer: ({row: {drop = []} = {}}) => {
                    const [{dropCity = '', dropState = ''}] = drop;
                    return `${dropCity}, ${dropState}`;
                }
            },
            {
                id: 'dropDate',
                label: 'Drop Date',
                renderer: ({row: {drop = []} = {}}) => {
                    const [{dropDate = ''}] = drop;
                    return moment(dropDate).format('MM/DD')
                }
            },

            {
                id: 'brokerage',
                label: 'Customer',
                renderer: ({row: {brokerage = ''} = {}}) => {
                    return brokerage;
                }
            },
            {
                id: 'rate',
                label: 'Rate',
                emptyState: '--'
            },
            {
                id: 'assignedTo',
                label: 'Assigned To',
                renderer: ({row}) => {
                    const {user = '', assignedTo} = row || {},
                        {firstName, lastName, name} =  assignedTo || user || {};
                    if(lastName){
                        return `${firstName} ${lastName}`
                    } else {
                        return name || '--'
                    }
                }
            },
        ]
    }), [rawLoades])

    return (
        <div className={classes.table}>
            <EnhancedTable config={tableConfig} data={rawLoades} loading={loading}/>
            {user?.role && <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                {['admin', 'superAdmin', 'dispatch', 'support'].includes(user.role) && <AddLoadForm/>}
            </Box>}
            {open.open && <LoadDetailModal
                modalEdit={false}
                open={open.open}
                load={open.data}
                handleClose={() => {
                    setOpen({open: false, data: {}});
                    dispatch(selectLoad());
                }}
                deleteLoad={(_id) => dispatch(deleteLoad(_id))}
            />}
        </div>
    );
};

const mapStateToProps = (state) => ({
    load: state.load,
    driver: state.driver,
});

export default connect(mapStateToProps, {getLoads, searchLoads})(Loadlistbar);
