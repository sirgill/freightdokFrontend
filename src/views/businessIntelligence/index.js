import {Stack, Box} from "@mui/material";
import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router-dom';
import BIDashboardTabs from "./BIDashboardTabs/BIDashboardTabs";
import {DateRangePicker} from "../../components/Atoms";
import moment from "moment";
import loadModuleAsync from "../../components/Atoms/LoadModuleAsync";
import {useSelector} from "react-redux";
import _ from "lodash";

const CardSection = loadModuleAsync(() => import("./cardSection/CardSection"));

const BITab = (props) => {
    const {canViewCards} = useSelector(state => _.get(state, 'auth.userPermissions.permissions.businessIntelligence', {}));
    const {match: {path = ''}, history} = props;
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const sun = moment().subtract(1, 'weeks').startOf('week');
    const sat = moment().subtract(1, 'weeks').endOf('week');


    useEffect(() => {
        setDateRange({
            key: 'selection',
            startDate: new Date(sun.toDate()),
            endDate: new Date(sat.toDate())
        })
    }, [path, history])

    return <Stack sx={{height: '100%', pt: 2, gap: 4}} className='dashboardRoot'>
        {canViewCards && <Box>
            <DateRangePicker label='Date Range' value={dateRange} pickerProps={{maxDate: sat.toDate()}}/>
        </Box>}
        {canViewCards && <CardSection/>}
        <BIDashboardTabs basePath={path} />
    </Stack>
}

export default withRouter(BITab);