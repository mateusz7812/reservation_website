import React from "react";
import {Redirect} from "react-router-dom";
import {addCookie} from "../services/CookieService";
import LoginForm from "./LoginForm";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";

class LoginPage extends React.Component{

    loginAccount(login: string, password: string) {
        // @ts-ignore
        return AccountService.getTokenForAccount(new AccountModel({"login": login, "password": password})).then(
             (token: string | undefined) => {
                 if (token !== undefined) {
                     addCookie("token", token);
                     return <Redirect to="/home"/>;
                 } else {
                     this.setState({"message": "error"})
                 }
             }
         );
    }

    render() {
        return(
            <LoginForm loginFunction={this.loginAccount}/>
        );
    }
}
export default LoginPage