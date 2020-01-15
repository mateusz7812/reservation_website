import React from "react";
import {Redirect, Route} from "react-router-dom";
import CookieService from "../../services/CookieService";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        const logged = CookieService.isLogged();
        return logged
            ? <Component {...props} />
            : <Redirect to='/login'/>;
    }} />
);

export default PrivateRoute