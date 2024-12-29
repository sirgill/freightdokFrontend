import {Stack, Box, IconButton} from "@mui/material";
import React, {lazy, Suspense, useCallback, useEffect, useState} from "react";
import {withRouter} from 'react-router-dom';
import {DateRangePicker, LoadingComponent} from "../../components/Atoms";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {fetchBI} from "../../actions/businessIntelligence.action";
import {Refresh} from "@mui/icons-material";
import {UserSettings} from "../../components/Atoms/client";

const CardSection = lazy(() => import("./cardSection/CardSection"));
const BITabs = lazy(() => import("./BIDashboardTabs/BITabs"));

const BITab = (props) => {
    const {canViewCards} = UserSettings.getUserPermissionsByDashboardId('businessIntelligence');
    const sun = moment().subtract(1, 'weeks').startOf('week');
    const sat = moment().subtract(1, 'weeks').endOf('week');
    const isRefetching = useSelector(state => _.get(state, 'businessIntelligence.isRefetching', false));
    const {match: {path = ''}, history} = props,
        dispatch = useDispatch()
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const onChange =  useCallback(({value}) => {
        const {startDate, endDate} = value;
            dispatch(fetchBI({startDate:moment(startDate).utc(true).toISOString(), endDate: moment(endDate).utc(true).toISOString()}, true ));
            setDateRange({
                ...dateRange,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            })
    }, [dateRange])

    useEffect(() => {
        setDateRange({
            key: 'selection',
            startDate: new Date(sun.toDate()),
            endDate: new Date(sat.toDate())
        })
    }, [path, history]);

    useEffect(() => {
        fetchBIData()
    }, [dateRange]);

    const fetchBIData = (refetch = false) => {
        dispatch(fetchBI({startDate: sun.toISOString(), endDate: sat.toISOString()}, refetch ));
    }

    return <Stack sx={{height: '100%', pt: 2, gap: {xs: 2, md: 4}, overflow: 'auto'}} className='dashboardRoot'>
        {canViewCards && <Box sx={{textAlign: 'right'}}>
            <DateRangePicker label='Date Range' value={dateRange} pickerProps={{maxDate: sat.toDate()}} onChange={onChange}/>
            <IconButton title='Refresh' onClick={fetchBIData.bind(null, true)}>
                <Refresh className={(isRefetching) ? 'rotateIcon' : undefined}/>
            </IconButton>
        </Box>}
        <Suspense fallback={<LoadingComponent />}>
            <CardSection/>
        </Suspense>
        <Suspense fallback={<LoadingComponent />}>
            <BITabs basePath={path} dateRange={dateRange} />
        </Suspense>
    </Stack>
}

export default withRouter(BITab);