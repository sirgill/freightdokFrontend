import {Stack, Box} from "@mui/material";
import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router-dom';
import BIDashboardTabs from "./BIDashboardTabs/BIDashboardTabs";
import {DateRangePicker} from "../../components/Atoms";
import moment from "moment";
import loadModuleAsync from "../../components/Atoms/LoadModuleAsync";

const CardSection = loadModuleAsync(() => import("./cardSection/CardSection"));

const BITab = (props) => {
    const {match: {path = ''}, history} = props;
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });


    useEffect(() => {
        history.replace(path + '/overview')
        const now = moment();
        const prev7Day = now.add(-6, 'days')
        const monday = now.clone().weekday(1);
        const friday = now.clone().weekday(5);
        const isNowWeekday = now.isBetween(monday, friday, null, '[]');

        console.log(`now: ${now.day()}`);
        console.log(`7 days back: ${new Date(prev7Day)}`);
        setDateRange({
            key: 'selection',
            startDate: new Date(prev7Day.toDate()),
            endDate: new Date(now.toDate())
        })
        // console.log(`monday: ${monday}`);
        // console.log(`friday: ${friday}`, now);
        // console.log(`is now between monday and friday: ${isNowWeekday}`);
    }, [path, history])

    return <Stack sx={{height: '100%', pt: 2, gap: 4}} className='dashboardRoot'>
        <Box>
            <DateRangePicker label='Date Range' value={dateRange} />
        </Box>
        <CardSection />
        <BIDashboardTabs basePath={path} />
    </Stack>
}

export default withRouter(BITab);