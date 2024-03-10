import OpenBoardIcon from "../assets/icons/openBoard.svg";
import MybidsIcon from "../assets/icons/icons8-bid-24.png";
import MyLoadsIcon from "../assets/icons/icons8-delivered-24.png";
import InvoiceIcon from "../assets/icons/icons8-invoices-24.png";
import UsersIcon from "../assets/icons/icons8-user-account-24.png";
import DriverIcon from "../assets/icons/icons8-driver-24.png";
import OwnerOperatorIcon from "../assets/icons/icons8-engineer-24.png";
import LoadHistoryIcon from "../assets/icons/icons8-bulleted-list-24.png";
import CarrierProfileIcon from "../assets/icons/settings-18-1-1-1-1-1.svg";
import FacilitiesIcon from '../assets/icons/icons8-warehouse-24.png'
import LoadModuleAsync from "../components/Atoms/LoadModuleAsync";

const OpenBoard = LoadModuleAsync(() => import("../views/openBoard/OpenBoard.js"));
const MyBids = LoadModuleAsync(() => import("../views/mybids/Mybids"));
const CarrierProfile = LoadModuleAsync(() => import("../views/carrierProfile/CarrierProfile"));
const OwnerOperator = LoadModuleAsync(() => import("../views/ownerOperator/OwnerOperator"));
const UsersList = LoadModuleAsync(() => import("../components/users/UsersList"));
const InvoicesList = LoadModuleAsync(() => import("../components/invoices/InvoicesList"));
const Driverlistbar = LoadModuleAsync(() => import("../components/driverbar/Driverlistbar.js"));
const Loadlistbar = LoadModuleAsync(() => import("../components/loadbar/Loadlistbar.js"));
const LoadsStatus = LoadModuleAsync(() => import("../components/loads/LoadsStatus"));
const Facilities = LoadModuleAsync(() => import("../components/facilities/Facilities"));

export const routes = [
    {
        id: 'open_board',
        title: 'Open Board',
        component: OpenBoard,
        icon: OpenBoardIcon,
        permissions: ['superAdmin', 'admin', 'dispatch', 'ownerOperator',]
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
        permissions: ['admin', 'superAdmin', 'dispatch', 'afterhours', 'ownerOperator', 'driver', 'support']
    }, {
        id: 'invoices',
        title: 'Invoices',
        component: InvoicesList,
        icon: InvoiceIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'support']
    }, {
        id: 'users',
        title: 'Users',
        component: UsersList,
        icon: UsersIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'support']
    }, {
        id: 'drivers',
        title: 'Drivers',
        component: Driverlistbar,
        icon: DriverIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'support']
    }, {
        id: 'owner_operator',
        title: 'Owner Operator',
        component: OwnerOperator,
        icon: OwnerOperatorIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'support']
    }, {
        id: 'loadHistory',
        title: 'Load History',
        component: LoadsStatus,
        icon: LoadHistoryIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'afterhours', 'ownerOperator', 'driver', 'support']
    }, {
        id: 'carrier_profile',
        title: 'Carrier Profile',
        component: CarrierProfile,
        icon: CarrierProfileIcon,
        permissions: ['admin', 'superAdmin', 'dispatch', 'support']
    }, {
        id: 'facilities',
        title: 'Facilities',
        component: Facilities,
        icon: FacilitiesIcon,
        permissions: ['admin', 'superAdmin', 'support']
    },
]

export const newRoutes = [
    {
        id: 'openBoard',
        title: 'Open Board',
        component: OpenBoard,
        icon: OpenBoardIcon,
        view: false
    }, {
        id: 'myBids',
        title: 'My Bids',
        component: MyBids,
        icon: MybidsIcon,
    }, {
        id: 'myLoads',
        title: 'My Loads',
        component: Loadlistbar,
        icon: MyLoadsIcon,
    }, {
        id: 'invoices',
        title: 'Invoices',
        component: InvoicesList,
        icon: InvoiceIcon,
    }, {
        id: 'users',
        title: 'Users',
        component: UsersList,
        icon: UsersIcon,
    }, {
        id: 'drivers',
        title: 'Drivers',
        component: Driverlistbar,
        icon: DriverIcon,
    }, {
        id: 'ownerOperator',
        title: 'Owner Operator',
        component: OwnerOperator,
        icon: OwnerOperatorIcon,
    }, {
        id: 'loadHistory',
        title: 'Load History',
        component: LoadsStatus,
        icon: LoadHistoryIcon,
    }, {
        id: 'carrierProfile',
        title: 'Carrier Profile',
        component: CarrierProfile,
        icon: CarrierProfileIcon,
    }, {
        id: 'facilities',
        title: 'Facilities',
        component: Facilities,
        icon: FacilitiesIcon,
    },
]