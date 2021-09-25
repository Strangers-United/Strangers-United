import React from "react";
import { Switch, Route } from "react-router-dom";
import About from "./containers/About";
import Home from "./containers/Home";

export interface IRoute {
    path: string;
    exact: boolean;
    component: React.ComponentType;
    name: string;
}

export const routeArr = [
    { path: "/", exact: true, component: Home, name: "Dashboard" },
    { path: "/about", exact: true, component: About, name: "About" },
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
