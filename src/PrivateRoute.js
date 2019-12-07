import React from "react";
import {Redirect, Route} from "react-router-dom";
import {getCookie} from "./CookieService";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        let token = getCookie("token");
        if(token === undefined){
            return <Redirect to='/login' />
        }
        return <Component {...props} />
        }} />
);

export default PrivateRoute