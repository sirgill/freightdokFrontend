import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Overview from "./tabPanelComponents/Overview";
import {useSelector} from "react-redux";
import _ from "lodash";
import Historical from "./tabPanelComponents/Historical";
import Financial from "./tabPanelComponents/Financial";
import {Paper} from "@mui/material";

function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 1}}>{children}</Box>}
        </Box>
    );
}

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BITabs = ({dateRange}) => {
    const query = useQuery().get('tab');
    const {
        financialTab,
        historicalTab,
        overviewTab
    } = useSelector(state => _.get(state, 'auth.userPermissions.permissions.businessIntelligence', {}));
    const [value, setValue] = useState(query || 'overview');
    const history = useHistory();
    const data = useSelector(state => _.get(state, 'businessIntelligence.businessIntelligenceData.data', {}))
    const loading = useSelector(state => _.get(state, 'businessIntelligence.loading', true));
    const isRefetching = useSelector(state => _.get(state, 'businessIntelligence.isRefetching', false));
    const {overview} = data,
        {startDate, endDate} = dateRange,
        presentableDateRange = `${new Date(startDate).toLocaleString('default', {month: 'short'})} ${new Date(startDate).getDate()} - ${new Date(endDate).toLocaleString('default', {month: 'short'})} ${new Date(endDate).getDate()}`;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const params = new URLSearchParams()
        if (value) {
            params.append("tab", value)
        } else {
            params.delete("tab")
        }
        history.replace({search: params.toString()})
    }, [value, history])

    return (
        <Paper elevation={0} width={'fit-content'}
               sx={{boxShadow: '0px 0px 32px #63636326', borderRadius: 5, overflow: 'hidden'}}>
            <Box sx={{width: '100%', height: 'inherit'}}>
                <Box sx={{}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {overviewTab && <Tab label="Overview" {...a11yProps(0)} value='overview'/>}
                        {historicalTab && <Tab label="Historical" {...a11yProps(1)} value='historical'/>}
                        {financialTab && <Tab label="Financial" {...a11yProps(2)} value='financial'/>}
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={'overview'}>
                    <Overview data={overview} loading={loading} isRefetching={isRefetching}
                              presentableDateRange={presentableDateRange}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={'historical'}>
                    <Historical/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={'financial'}>
                    <Financial/>
                </CustomTabPanel>
            </Box>
        </Paper>
    )
}

export default BITabs;