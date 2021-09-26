import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import Ipfs from "./containers/IPFS";

export interface IRoute {
    path: string;
    exact: boolean;
    component: React.ComponentType;
    name: string;
}

export const routeArr = [
    { path: "/", exact: true, component: Home, name: "Dashboard" },
    { path: "/ipfs", exact: true, component: Ipfs, name: "Ipfs" },
] as IRoute[];

const Routes = () => {
    return (
        <Switch>
            {routeArr.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                />
            ))}
        </Switch>
    );
};

export default Routes;
