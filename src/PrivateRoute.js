import React from "react";
import {Redirect, Route} from "react-router-dom";
import {getToken} from "./services/CookieService";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        let token = getToken();
        if(token === undefined){
            return <Redirect to='/login' />
        }
        return <Component {...props} />
        }} />
);

export default PrivateRoute