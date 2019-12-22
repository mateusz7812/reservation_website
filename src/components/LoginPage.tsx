import React from "react";
import {withRouter} from "react-router-dom";
import {addCookie} from "../services/CookieService";
import LoginForm from "./LoginForm";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";

class LoginPage extends React.Component{
    state = {message: ""};

    redirect = (path:string)=>{
        // @ts-ignore
        this.props.history.push(path);
    };

    loginAccount = (login: string, password: string) => {
        // @ts-ignore
        return AccountService.getTokenForAccount(new AccountModel({"login": login, "password": password})).then(
             (token: string | undefined) => {
                 if (token !== undefined) {
                     addCookie("token", token);
                     this.redirect('/');
                 } else {
                     this.setState({"message": "error"})
                 }
             }
         );
    };

    render = ()=>{
        return(
            <div>
                <LoginForm loginFunction={this.loginAccount}/>
                <p id={"errorLabel"}>{this.state.message}</p>
                <input type="button" id="registerButton" onClick={()=>this.redirect("/register")}/>
            </div>
        );
    }
}

// @ts-ignore
export default withRouter(LoginPage)