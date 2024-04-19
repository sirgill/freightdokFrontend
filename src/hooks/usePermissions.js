import {UserSettings} from "../components/Atoms/client";
import {Route} from "react-router-dom";
import React from "react";

const usePermissions = (routes, path) => {
    const {permissions = {}} = UserSettings.getUserPermissions();
    let firstLink = ''
    const links = [],
        dashboardRoutes = [];
    routes.forEach((route, i) => {
        const {id} = route;
        if (permissions.hasOwnProperty(id)) {
            const {view} = permissions[id];
            if (view) {
                dashboardRoutes.push(route);
                const _route = <Route path={`${path}/${id}`} component={route.component} key={route.id}/>
                links.push(_route);
                if (!firstLink) {
                    firstLink = `${path}/${id}`;
                }
            }
        }
    })
    return {links, firstLink, dashboardRoutes}
}

export default usePermissions;