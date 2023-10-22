import {Route, Switch} from "react-router-dom";
import React, {useEffect} from "react";
import {ENHANCED_DASHBOARD} from "../components/client/routes";
import {getRoutesByPermission} from "../utils/utils";
import useRoutes from "../hooks/useRoutes";
import Error401 from "./Error401";
import DeleteComponent from "../components/Atoms/DeleteComponent";
import {routes} from "../config/dashboardRoutes";
import MiniDrawer from "./Sidebar";


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
