import {Route, Switch} from "react-router-dom";
import LoadModuleAsync from "../components/Atoms/LoadModuleAsync";
import React, {useMemo} from "react";
import OpenBoardIcon from '../assets/icons/openBoard.svg'

import MybidsIcon from "../assets/icons/icons8-bid-24.png";
import MyLoadsIcon from "../assets/icons/icons8-delivered-24.png";
import UsersIcon from "../assets/icons/icons8-user-account-24.png";
import InvoiceIcon from "../assets/icons/icons8-invoices-24.png";
import DriverIcon from "../assets/icons/icons8-driver-24.png";
import OwnerOperatorIcon from "../assets/icons/icons8-engineer-24.png";
import LoadHistoryIcon from "../assets/icons/icons8-bulleted-list-24.png";
import CarrierProfileIcon from "../assets/icons/settings-18-1-1-1-1-1.svg";

const MiniDrawer = LoadModuleAsync(() => import("./Sidebar"));
const OpenBoard = LoadModuleAsync(() => import("../views/openBoard/OpenBoard.js"));
const MyBids = LoadModuleAsync(() => import("../views/mybids/Mybids"));
const CarrierProfile = LoadModuleAsync(() => import("../views/carrierProfile/CarrierProfile"));
const OwnerOperator = LoadModuleAsync(() => import("../views/ownerOperator/OwnerOperator"));
const UsersList = LoadModuleAsync(() => import("../components/users/UsersList"));
const InvoicesList = LoadModuleAsync(() => import("../components/invoices/InvoicesList"));
const Driverlistbar = LoadModuleAsync(() => import("../components/driverbar/Driverlistbar.js"));
const InvoicesWizard = LoadModuleAsync(() => import("../components/invoices/InvoicesWizard"));
const Loadlistbar = LoadModuleAsync(() => import("../components/loadbar/Loadlistbar.js"));
const LoadsStatus = LoadModuleAsync(() => import("../components/loads/LoadsStatus"));

const routes = [
    {
        id: 'open_board',
        title: 'Open Board',
        component: OpenBoard,
        icon: OpenBoardIcon
    },{
        id: 'my_bids',
        title: 'My Bids',
        component: MyBids,
        icon: MybidsIcon
    },{
        id: 'my_loads',
        title: 'My Loads',
        component: Loadlistbar,
        icon: MyLoadsIcon
    },{
        id: 'invoices',
        title: 'Invoices',
        component: InvoicesList,
        icon: InvoiceIcon
    },{
        id: 'users',
        title: 'Users',
        component: UsersList,
        icon: UsersIcon
    },{
        id: 'drivers',
        title: 'Drivers',
        component: Driverlistbar,
        icon: DriverIcon
    },{
        id: 'owner_operator',
        title: 'Owner Operator',
        component: OwnerOperator,
        icon: OwnerOperatorIcon
    },{
        id: 'loadHistory',
        title: 'Load History',
        component: LoadsStatus,
        icon: LoadHistoryIcon
    },{
        id: 'carrier_profile',
        title: 'Carrier Profile',
        component: CarrierProfile,
        icon: CarrierProfileIcon
    },
]

const Dashboard = ({match: {path} = {}, history}) => {
    let firstLink = ''
    const links = useMemo(() => {
        return routes.map((route, i) => {
            const dashboardPath = path + '/' + route.id
            if(i===0){
                firstLink = dashboardPath
            }
            return <Route path={dashboardPath} component={route.component} />
        })
    }, [])

    React.useEffect(() => {
        history.push(firstLink);
    }, [])

    return <>
        <MiniDrawer routes={routes} basePath={path}>
            <Switch>
                {links}
                {/*<Route path="/loads" component={Loads}/>*/}
            </Switch>
        </MiniDrawer>
    </>
}

export default Dashboard;

// const classes = useStyles();
// const [mobileOpen, setMobileOpen] = React.useState(false);
// const goToHome = useCallback(() => {
//     history.push('/home')
// }, [])
//
// const drawer = (
//     <Fragment>
//         <div className={classes.profile}>
//             <Grid
//                 container
//                 justify="center"
//             >
//                 <Grid item xs={12}>
//                     <Typography onClick={goToHome} align='center' sx={{
//                         color: '#fff',
//                         fontWeight: 900,
//                         fontSize: 25,
//                         cursor: 'pointer'
//                     }}>freightdok</Typography>
//                 </Grid>
//             </Grid>
//         </div>
//         <List sx={{px: 3, height: 'calc(100% - 277px)', overflow: 'auto', mt: 2}}>
//             <ListItemHelper
//                 // onClick={() => {
//                 //     setListBarType("Open Load Board");
//                 // }}
//                 icon={OpenBoardIcon}
//                 primary={"Open Load Board"}
//             />
//             <ListItemHelper
//                 // onClick={() => {
//                 //     setListBarType("My Bids");
//                 // }}
//                 icon={Mybids}
//                 primary={"My Bids"}
//             />
//             <ListItemHelper
//                 // onClick={() => {
//                 //     setListBarType("My Loads");
//                 // }}
//                 icon={MyLoads}
//                 primary={"My Loads"}
//             />
//         </List>
//     </Fragment>
// );
// return <>
//     <nav className={classes.drawer} aria-label="mailbox folders">
//         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
//         <Hidden smUp implementation="css">
//             <Drawer
//                 // container={container}
//                 variant="temporary"
//                 anchor={theme.direction === "rtl" ? "right" : "left"}
//                 open={mobileOpen}
//                 // onClose={handleDrawerToggle}
//                 classes={{paper: classes.drawerPaper}}
//                 ModalProps={{
//                     keepMounted: true, // Better open performance on mobile.
//                 }}
//             >
//                 {drawer}
//             </Drawer>
//         </Hidden>
//         <Hidden xsDown implementation="css">
//             <Drawer
//                 classes={{paper: classes.drawerPaper}}
//                 variant="permanent"
//                 open
//             >
//                 {drawer}
//             </Drawer>
//         </Hidden>
//     </nav>
