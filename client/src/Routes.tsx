import React from "react";
import {
HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import About from "./containers/About";
import Home from "./containers/Home";

const Routes = () => {
    return (
        <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/about" exact component={About} />
                </Switch>
        </Router>
    )
}

export default Routes