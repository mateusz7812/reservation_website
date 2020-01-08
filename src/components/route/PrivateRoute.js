import React from "react";
import {Redirect, Route} from "react-router-dom";
import CookieService from "../../services/CookieService";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
            if (CookieService.isLogged()) {
                    return <Component {...props} />
            } else {
                    return <Redirect to='/login'/>
            }
    }} />
);

export default PrivateRoute