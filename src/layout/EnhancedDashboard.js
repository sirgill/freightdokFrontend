import {Route, Switch} from "react-router-dom";
import React, {useLayoutEffect} from "react";
import {ENHANCED_DASHBOARD, ERROR_404_LINK} from "../components/client/routes";
import useRoutes from "../hooks/useRoutes";
import {dashboardConfig, routes} from "../config/dashboardRoutes";
import MiniDrawer from "./Sidebar";
import store from "../store";
import {loadUser} from "../actions/auth";
import Error404 from "./404";
import usePermissions from "../hooks/usePermissions";
import loadModuleAsync from "../components/Atoms/LoadModuleAsync";
import {CacheProvider} from "../provider/CacheProvider";

const Error401 = loadModuleAsync(() => import("./Error401"))
const ChangePasswordModal = loadModuleAsync(() => import("../views/auth/ChangePasswordModal"));
const DeleteComponent = loadModuleAsync(() => import("../components/Atoms/DeleteComponent"));

const Dashboard = ({match = {}, history, location}) => {
    const {pathname} = location,
        {path} = match,
        supportsNewPermission = JSON.parse(localStorage.getItem('supportsNewPermission') || '{}');
    const {links, firstLink, dashboardRoutes} = useRoutes(routes, path),
        {links: newLinks, firstLink: newFirstLink, dashboardRoutes: newDashboardRoutes} = usePermissions(dashboardConfig, path);


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
        <CacheProvider>
            <MiniDrawer routes={supportsNewPermission ? newDashboardRoutes : dashboardRoutes} basePath={path}>
                <Switch>
                    {supportsNewPermission ? newLinks : links}
                    <Route path={ERROR_404_LINK} component={Error404} />
                    <Route path="*" component={Error401} />
                </Switch>
                <DeleteComponent />
                <ChangePasswordModal />
            </MiniDrawer>
        </CacheProvider>
    </>
}

export default Dashboard;
