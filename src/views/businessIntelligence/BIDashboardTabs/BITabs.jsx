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

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
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
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
const BITabs = () => {
    const query = useQuery().get('tab');
    const {financialTab, historicalTab, overviewTab} = useSelector(state => _.get(state, 'auth.userPermissions.permissions.businessIntelligence', {}));
    const [value, setValue] = useState(query || 'overview');
    const history = useHistory();

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
        <Box sx={{ width: '100%' }}>
            <Box sx={{  }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {overviewTab && <Tab label="Overview" {...a11yProps(0)} value='overview' />}
                    {historicalTab && <Tab label="Historical" {...a11yProps(1)} value='historical'/>}
                    {financialTab && <Tab label="Financial" {...a11yProps(2)} value='financial'/>}
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={'overview'}>
                <Overview />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={'historical'}>
                <Historical />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={'financial'}>
                <Financial />
            </CustomTabPanel>
        </Box>
    )
}

export default BITabs;