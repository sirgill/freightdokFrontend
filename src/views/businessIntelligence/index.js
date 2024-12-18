import {Stack, Box} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {withRouter} from 'react-router-dom';
import BIDashboardTabs from "./BIDashboardTabs/BIDashboardTabs";
import {DateRangePicker} from "../../components/Atoms";
import moment from "moment";
import loadModuleAsync from "../../components/Atoms/LoadModuleAsync";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {fetchBI} from "../../actions/businessIntelligence.action";

const CardSection = loadModuleAsync(() => import("./cardSection/CardSection"));

const BITab = (props) => {
    const {canViewCards} = useSelector(state => _.get(state, 'auth.userPermissions.permissions.businessIntelligence', {}));
    const sun = moment().subtract(1, 'weeks').startOf('week');
    const sat = moment().subtract(1, 'weeks').endOf('week');
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
        dispatch(fetchBI({startDate: sun.toISOString(), endDate: sat.toISOString()} ));
    }, [path, history])

    return <Stack sx={{height: '100%', pt: 2, gap: 4}} className='dashboardRoot'>
        {canViewCards && <Box>
            <DateRangePicker label='Date Range' value={dateRange} pickerProps={{maxDate: sat.toDate()}} onChange={onChange}/>
        </Box>}
        {<CardSection/>}
        <BIDashboardTabs basePath={path} />
    </Stack>
}

export default withRouter(BITab);