import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import OOF from "./containers/OOF";
import Ipfs from "./containers/IPFS";
import Chance from "./containers/Chance";

export interface IRoute {
    path: string;
    exact: boolean;
    component: React.ComponentType;
    name: string;
}

export const routeArr = [
    { path: "/", exact: true, component: Home, name: "Dashboard" },
    { path: "/ipfs", exact: true, component: Ipfs, name: "Ipfs" },
    {
        path: "/chance",
        exact: true,
        component: Chance,
        name: "Lab Experiments",
    },
    {
        path: "/oof",
        exact: true,
        component: OOF,
        name: "Open Oracle Framework",
    },
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
