import {Box, Paper, Tab, Tabs} from "@mui/material";
import styled from "@mui/material/styles/styled";
import {Link, matchPath} from "react-router-dom";
import {useLocation} from "react-router";

const CustomTab = styled(Tab)(() => ({
    '&:hover': {
        textDecoration: 'none'
    }
}));

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function useRouteMatch(patterns) {
    const { pathname } = useLocation();

    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i];
        const possibleMatch = matchPath(pattern, pathname);
        if (possibleMatch !== null) {
            return possibleMatch;
        }
    }

    return null;
}
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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Box>
    );
}

const MyTabs = ({basePath}) => {
    const routeMatch = useRouteMatch([basePath + '/overview', basePath + '/historical', basePath + '/loads', basePath + '/financial']);
    const currentTab = routeMatch?.path;

    return (
        <Box>
            <Tabs value={currentTab}>
                <CustomTab label="Overview" value={basePath + "/overview"} to={basePath + "/overview"} component={Link} {...a11yProps(basePath + "/overview")} />
                <CustomTab label="Loads" value={basePath + "/loads"} to={basePath + "/loads"} component={Link} {...a11yProps(basePath + "/loads")} />
                <CustomTab label="Historical" value={basePath + "/historical"} to={basePath + "/historical"} component={Link} {...a11yProps(basePath + "/historical")}/>
                <CustomTab label="Financial" value={basePath + "/financial"} to={basePath + "/financial"} component={Link} {...a11yProps(0)}/>
            </Tabs>
            <CustomTabPanel value={basePath + "/overview"} index={currentTab}>
                <h1>Overview</h1>
            </CustomTabPanel>
            <CustomTabPanel value={basePath + "/loads"} index={currentTab}>
                <h1>Loads</h1>
            </CustomTabPanel>
            <CustomTabPanel value={basePath + "/historical"} index={currentTab}>
                <h1>Historical</h1>
            </CustomTabPanel>
            <CustomTabPanel value={basePath + "/financial"} index={currentTab}>
                <h1>Financial</h1>
            </CustomTabPanel>
        </Box>
    );
}


const BIDashboardTabs = ({basePath}) => {
    return <Paper elevation={0} width={'fit-content'} sx={{boxShadow: '0px 0px 32px #63636326', borderRadius: 5, overflow: 'hidden'}}>
        <MyTabs basePath={basePath} />
    </Paper>
}

export default BIDashboardTabs;