import React, { useCallback, useEffect, useMemo, useState } from "react";
import {Box, Button, IconButton, Popover, Stack, useMediaQuery} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import { LoadDetails } from "./LoadDetails";
import { getOpenBoardLoads } from "../../actions/openBoard.action";
import Bid from "./Bid";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { developmentPayload, productionPayload } from "./constants";
import BookNowForm from "./BookNowForm";
import { addEvent, removeEvent } from "../../utils/utils";
import NewTrulLoadDetails from "./NewTrulLoadDetails";
import NewtrulFilters from "./NewtrulFilters";
import { Refresh } from "@mui/icons-material";
import { tableConfig } from "./config";
import Dialog from "../../components/Atoms/Dialog";
import BrokerSetupMessage from "../../components/common/BrokerSetupMessage";

let payload = developmentPayload;

if (process.env.NODE_ENV === "production") {
    payload = productionPayload;
}

// const CARRIER_CODE = "T2244688";

const OpenBoard = () => {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const { path } = useRouteMatch(),
        [filters, setFilters] = useState(payload),
        [params, setParams] = useState(''),
        [dialog, setDialog] = useState({ open: false, content: null }),
        dispatch = useDispatch(),
        { data: { results, totalResults, message } = {}, loading = false } = useSelector((state) => state.openBoard),
        history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const getBidListWithFilter = useCallback((filters, params = '') => {
        onClosePopover();
        dispatch(getOpenBoardLoads({ ...filters, newTrulQuery: params, env: process.env.NODE_ENV, pageSize: 100 }))
    }, [dispatch])

    const getBiddingList = useCallback(() => {
        dispatch(getOpenBoardLoads({ ...filters, newTrulQuery: params, env: process.env.NODE_ENV, pageSize: 100 }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, filters, params])

    const onCloseDialog = useCallback(() => {
        setDialog((prev) => ({ ...prev, open: false }))
    }, [])

    const showDialog = useCallback(({ content }) => {
        setDialog((prev) => ({ ...prev, open: true, content }));
    }, [])

    useEffect(() => {
        getBiddingList();
        addEvent(window, 'getBiddings', getBiddingList);

        return () => removeEvent(window, 'getBiddings', getBiddingList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onPageChange = (e, pgNum) => {
        setFilters((prev) => {
            getBidListWithFilter({ ...prev, pageIndex: pgNum - 1 }, params);
            return { ...prev, pageIndex: pgNum - 1 }
        });
    };

    const onClosePopover = () => {
        setAnchorEl(null);
    }

    const table = useMemo(() => <EnhancedTable
        config={tableConfig({ showDialog, history, path, totalResults, onPageChange, pageSize: filters.pageSize, pageIndex: filters.pageIndex })}
        data={results || []}
        loading={loading}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    />, [results])

    const filtersComp = <NewtrulFilters
        defaultParams={payload}
        setParams={setParams}
        setFilters={setFilters}
        pageSize={filters.pageSize}
        pageIndex={filters.pageIndex}
        getNewTrulList={getBidListWithFilter}
        onRefetch={getBiddingList}
    />

    if (message) {
        return <BrokerSetupMessage message={message} />
    }

    return (
        <Stack style={{ gap: '10px', height: '100%', }}>
            <Stack direction={'row'} justifyContent='end'>
                <Stack>
                    <IconButton title='Refresh' onClick={getBiddingList}>
                        <Refresh className={loading ? 'rotateIcon' : undefined} />
                    </IconButton>
                </Stack>
                {isMobile && <Stack>
                    <Button
                        aria-describedby={'open-board-filters'} variant='outlined'
                        onClick={handleClick}
                        endIcon={<ArrowDropDownIcon />}
                    >
                        Filters
                    </Button>
                </Stack>}
            </Stack>
            {isMobile ?
                <Popover
                    open={!!anchorEl}
                    PaperProps={{sx: {p: 3}}}
                    id='open-board-filters' onClose={onClosePopover}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    {filtersComp}
                </Popover> :
                filtersComp
            }
            <Box sx={{height: '100%' , overflow: 'hidden'}}>
                {table}
            </Box>
            <Route path={path + "/newtrul/:loadId"} component={NewTrulLoadDetails} />
            <Route path={path + "/:loadNumber"} exact component={LoadDetails} />
            <Route path={path + "/:loadNumber/bid"} component={Bid} />
            <Route path={path + "/:loadNumber/bookNow"} component={BookNowForm} />
            <Dialog onClose={onCloseDialog} config={dialog} />
        </Stack>
    );
};

export default withRouter(OpenBoard);
