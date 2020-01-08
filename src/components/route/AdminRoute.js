import React from "react";
import {Redirect, Route} from "react-router-dom";
import CookieService from "../../services/CookieService";

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
            if (CookieService.getAccount().isAdmin()) {
                    return <Component {...props} />
            } else {
                    return <Redirect to='/'/>
            }
    }} />
);

export default AdminRoute