import {Redirect, Route} from "react-router-dom";
import {getCookie} from "./src/services/CookieService";
import React from "react";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        let token = getCookie("token");
        if (token === undefined) {
            return <Component {...props} />
        } else {
            return <Redirect to='/'/>
        }
    }} />
);

export default PrivateRoute