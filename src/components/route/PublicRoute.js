import {Redirect, Route} from "react-router-dom";
import CookieService from "../../services/CookieService";
import React from "react";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        if (CookieService.isLogged()) {
            return <Redirect to='/'/>
        } else {
            return <Component {...props} />
        }
    }} />
);

export default PrivateRoute