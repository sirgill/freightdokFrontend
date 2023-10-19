import {Route, Switch} from "react-router-dom";
import LoadModuleAsync from "../components/Atoms/LoadModuleAsync";
import React, {useEffect} from "react";
import OpenBoardIcon from '../assets/icons/openBoard.svg'

import MybidsIcon from "../assets/icons/icons8-bid-24.png";
import MyLoadsIcon from "../assets/icons/icons8-delivered-24.png";
import UsersIcon from "../assets/icons/icons8-user-account-24.png";
import InvoiceIcon from "../assets/icons/icons8-invoices-24.png";
import DriverIcon from "../assets/icons/icons8-driver-24.png";
import OwnerOperatorIcon from "../assets/icons/icons8-engineer-24.png";
import LoadHistoryIcon from "../assets/icons/icons8-bulleted-list-24.png";
import CarrierProfileIcon from "../assets/icons/settings-18-1-1-1-1-1.svg";
import {ENHANCED_DASHBOARD} from "../components/client/routes";
import {getRoutesByPermission} from "../utils/utils";
import useRoutes from "../hooks/useRoutes";
import Error401 from "./Error401";
import DeleteComponent from "../components/Atoms/DeleteComponent";

const MiniDrawer = LoadModuleAsync(() => import("./Sidebar"));
const OpenBoard = LoadModuleAsync(() => import("../views/openBoard/OpenBoard.js"));
const MyBids = LoadModuleAsync(() => import("../views/mybids/Mybids"));
const CarrierProfile = LoadModuleAsync(() => import("../views/carrierProfile/CarrierProfile"));
const OwnerOperator = LoadModuleAsync(() => import("../views/ownerOperator/OwnerOperator"));
const UsersList = LoadModuleAsync(() => import("../components/users/UsersList"));
const InvoicesList = LoadModuleAsync(() => import("../components/invoices/InvoicesList"));
const Driverlistbar = LoadModuleAsync(() => import("../components/driverbar/Driverlistbar.js"));
const Loadlistbar = LoadModuleAsync(() => import("../components/loadbar/Loadlistbar.js"));
const LoadsStatus = LoadModuleAsync(() => import("../components/loads/LoadsStatus"));

const routes = [
    {
        id: 'open_board',
        title: 'Open Board',
        component: OpenBoard,
        icon: OpenBoardIcon,
        permissions: ['superAdmin', 'admin', 'dispatch', 'ownerOperator']
    }, {
        id: 'my_bids',
        title: 'My Bids',
        component: MyBids,
        icon: MybidsIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'ownerOperator']
    }, {
        id: 'my_loads',
        title: 'My Loads',
        component: Loadlistbar,
        icon: MyLoadsIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'afterhours', 'ownerOperator', 'driver']
    }, {
        id: 'invoices',
        title: 'Invoices',
        component: InvoicesList,
        icon: InvoiceIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'ownerOperator']
    }, {
        id: 'users',
        title: 'Users',
        component: UsersList,
        icon: UsersIcon,
        permissions: ['admin', 'superAdmin', 'dispatch']
    }, {
        id: 'drivers',
        title: 'Drivers',
        component: Driverlistbar,
        icon: DriverIcon,
        permissions: ['admin', 'superAdmin', 'dispatch']
    }, {
        id: 'owner_operator',
        title: 'Owner Operator',
        component: OwnerOperator,
        icon: OwnerOperatorIcon,
        permissions: ['admin', 'superAdmin', 'ownerOperator', 'dispatch']
    }, {
        id: 'loadHistory',
        title: 'Load History',
        component: LoadsStatus,
        icon: LoadHistoryIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'afterhours', 'ownerOperator', 'driver']
    }, {
        id: 'carrier_profile',
        title: 'Carrier Profile',
        component: CarrierProfile,
        icon: CarrierProfileIcon,
        permissions: ['admin', 'superAdmin', 'dispatch']
    },
]

const Dashboard = ({match = {}, history, location}) => {
    const {pathname} = location,
        {path} = match;
    const dashboardRoutes = getRoutesByPermission(routes);
    const {links, firstLink} = useRoutes(routes, path);

    useEffect(() => {
        if (pathname === ENHANCED_DASHBOARD || pathname === ENHANCED_DASHBOARD + '/') {
            history.push(firstLink);
        }
    }, [])

    return <>
        <MiniDrawer routes={dashboardRoutes} basePath={path}>
            <Switch>
                {links}
                <Route path="*" component={Error401} />
            </Switch>
            <DeleteComponent />
        </MiniDrawer>
    </>
}

export default Dashboard;
