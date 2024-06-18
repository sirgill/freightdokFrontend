import React, {useEffect, useMemo, useState} from "react";
import moment from 'moment';
import {Box, IconButton, Stack} from "@mui/material";
import {connect, useDispatch, useSelector} from "react-redux";
import {deleteLoad, getLoads, searchLoads, selectLoad} from "../../actions/load";
import _ from "lodash";
import EnhancedTable from "../Atoms/table/Table";
import LoadDetailModal from "../loads/LoadDetailModal";
import AddLoadForm from "../load-forms/AddLoad";
import {UserSettings} from "../Atoms/client";
import {Input} from "../Atoms";
import {Close} from "@mui/icons-material";

const {add, delete: hasDeletePermission, edit} = UserSettings.getUserPermissionsByDashboardId('loads');


const Loadlistbar = ({
                         getLoads,
                         searchLoads,
                         load: {loads, loads_pagination, page, rowsPerPage = 100},
                         resetSearchField, searchText
                     }) => {
    const dispatch = useDispatch(),
        [search, setSearch] = useState('');
    // const { query, loads: sLoads, page: sPage, limit, total: sTotal } = search;
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState({open: false, data: {}});
    const {total, currPage} = loads_pagination;
    const [rawLoades, setRawLoads] = useState([]);
    const {auth: {user = {}} = {}} = useSelector((state) => state),
        {query, loads: sLoads, page: sPage, limit, total: sTotal} = useSelector(state => state.load.search);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        resetSearchField && resetSearchField();
        getLoads(page, rowsPerPage, '', search);
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
        // const interval = setInterval(() => {
        //     getLoads(page);
        // }, 3000)
        //
        // return () => {
        //     clearInterval(interval);
        // }
    }, [loads, sLoads, page]);

    useEffect(() => {
        const debouncedSearch = _.debounce(() => {
            getLoads(page, rowsPerPage, '', search)
        }, 500);

        debouncedSearch();

        return debouncedSearch.cancel;
    }, [search])

    const handleChangePage = (event, newPage) => {
        newPage = newPage - 1
        getLoads(newPage, rowsPerPage, '', search);
    };

    const handleChangeRowsPerPage = ({value}) => {
        getLoads(0, value, '', search);
    };

    const onDelete = (id, onDialogClose) => {
        dispatch(deleteLoad(id, (success) => {
            if (success) {
                setTimeout(() => getLoads(page, rowsPerPage, '', search), 500)
                onDialogClose();
            }
        }))
    }

    const tableConfig = useMemo(() => ({
        showRefresh: true,
        onRowClick: (row) => setOpen({open: true, data: row}),
        rowCellPadding: 'normal',
        count: query ? sTotal : total,
        page: page + 1,
        limit: query ? sPage : rowsPerPage,
        onPageChange: handleChangePage,
        onPageSizeChange: handleChangeRowsPerPage,
        hasDelete: true,
        onDelete,
        deletePermissions: !!hasDeletePermission,
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
                emptyState: '--',
                valueFormatter: (value) => value ? '$' + value : ''
            },
            {
                id: 'assignedTo',
                label: 'Assigned To',
                renderer: ({row}) => {
                    const {user = '', assignedTo} = row || {},
                        {firstName, lastName, name} = assignedTo || user || {};
                    if (lastName) {
                        return `${firstName} ${lastName}`
                    } else {
                        return name || '--'
                    }
                }
            },
            {
                id: 'createdAt',
                label: 'Created On',
                valueFormatter: (value) => new Date(value).toLocaleString()
            },
        ]
    }), [rawLoades])

    const onSearch = ({value}) => {
        setSearch(value)
    }

    const actions = <Box sx={{display: 'flex', alignItems: 'center', gap:2}}>
        <Stack component='form' direction='row' gap={1}>
            <Input onChange={onSearch} placeholder='Search'
                   sx={{
                       '& .MuiOutlinedInput-root': {
                           pr: 0
                       }
                   }}
                   autoFocus
                   value={search}
                   InputProps={{
                       endAdornment: <IconButton onClick={() => setSearch('')} sx={{visibility: search ? 'visible' : 'hidden'}}>
                           <Close fontSize='small' />
                       </IconButton>
                   }}
            />
        </Stack>
        <AddLoadForm hasAddPermission={!!add}/>
    </Box>;

    return (
        <Box sx={{height: 'inherit'}}>
            <EnhancedTable
                config={tableConfig}
                data={rawLoades}
                loading={loading}
                actions={actions}
                onRefetch={() => getLoads(page, rowsPerPage, '', search)}
            />
            {open.open && <LoadDetailModal
                modalEdit={false}
                open={open.open}
                load={open.data}
                handleClose={() => {
                    setOpen({open: false, data: {}});
                    dispatch(selectLoad());
                }}
                deleteLoad={(_id) => dispatch(deleteLoad(_id))}
                canUpdate={!!edit}
            />}
        </Box>
    );
};

const mapStateToProps = (state) => ({
    load: state.load,
    driver: state.driver,
});

export default connect(mapStateToProps, {getLoads, searchLoads})(Loadlistbar);
