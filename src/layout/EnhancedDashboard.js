import {Route, Switch} from "react-router-dom";
import React, {useLayoutEffect} from "react";
import {ENHANCED_DASHBOARD, ERROR_404_LINK} from "../components/client/routes";
import useRoutes from "../hooks/useRoutes";
import Error401 from "./Error401";
import DeleteComponent from "../components/Atoms/DeleteComponent";
import {newRoutes, routes} from "../config/dashboardRoutes";
import MiniDrawer from "./Sidebar";
import store from "../store";
import {loadUser} from "../actions/auth";
import ChangePasswordModal from "../views/auth/ChangePasswordModal";
import Error404 from "./404";
import usePermissions from "../hooks/usePermissions";


const Dashboard = ({match = {}, history, location}) => {
    const {pathname} = location,
        {path} = match,
        supportsNewPermission = JSON.parse(localStorage.getItem('supportsNewPermission'));
    const {links, firstLink, dashboardRoutes} = useRoutes(routes, path),
        {links: newLinks, firstLink: newFirstLink, dashboardRoutes: newDashboardRoutes} = usePermissions(newRoutes, path);


    useLayoutEffect(() => {
        store.dispatch(loadUser());
        const defaultLink = supportsNewPermission ? newFirstLink : firstLink
        if (!defaultLink) {
            return history.push(ERROR_404_LINK);
        }
        if (pathname === ENHANCED_DASHBOARD || pathname === ENHANCED_DASHBOARD + '/') {
            history.push(defaultLink);
        }
        return () => {
            document.title = 'freightdok'
        }
    }, [])

    return <>
        <MiniDrawer routes={supportsNewPermission ? newDashboardRoutes : dashboardRoutes} basePath={path}>
            <Switch>
                {supportsNewPermission ? newLinks : links}
                <Route path={ERROR_404_LINK} component={Error404} />
                <Route path="*" component={Error401} />
            </Switch>
            <DeleteComponent />
            <ChangePasswordModal />
        </MiniDrawer>
    </>
}

export default Dashboard;
