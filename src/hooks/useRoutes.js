import React, {useMemo} from "react";
import {Route} from "react-router-dom";
import {getRoutesByPermission} from "../utils/utils";

const useRoutes = (routes, path) => {
    let firstLink = '';
    const dashboardRoutes = useMemo(() => getRoutesByPermission(routes), [routes]);
    const links = useMemo(() => {
        return dashboardRoutes.map((route, i) => {
            const dashboardPath = path + '/' + route.id
            if (i === 0) {
                firstLink = dashboardPath
            }

            return <Route path={dashboardPath} component={route.component} key={route.id}/>
        });
    }, [dashboardRoutes]);

    return {
        links, firstLink, dashboardRoutes
    }
}

export default useRoutes;