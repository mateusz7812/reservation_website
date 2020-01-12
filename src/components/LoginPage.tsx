import React from "react";
import {withRouter} from "react-router-dom";
import CookieService from "../services/CookieService";
import LoginForm from "./LoginForm";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import styled from "styled-components";
import {StyledInput} from "./StyledComponents";


class LoginPage extends React.Component{
    state = {message: ""};

    redirect = (path:string)=>{
        // @ts-ignore
        this.props.history.push(path);
    };

    loginAccount = (login: string, password: string) => {
        return AccountService.getTokenForAccount(new AccountModel({"login": login, "password": password}))?.then(
             (tokenObject: {} | undefined) => {
                 if (tokenObject !== undefined) {
                     // @ts-ignore
                     CookieService.setToken(tokenObject["token"]);
                     // @ts-ignore
                     return AccountService.getById(tokenObject["account"])
                         .then((account: AccountModel)=>{
                             CookieService.setAccount(account);
                             return account;
                         }).then((account: AccountModel)=>{
                             if(account.isAdmin())
                                 this.redirect("/admin");
                             else
                                 this.redirect('/');
                         }).catch(()=>CookieService.setToken(""));
                 } else {
                     this.setState({"message": "error"})
                 }
             }
         );
    };

    render = ()=>{

        const StyledDiv = styled.div`
            width: 300px;
            height: 300px;
            background-color: lightgray;
            border-radius:20px;
            padding: 20px;
            `;

        return(
            <StyledDiv>
                <LoginForm loginFunction={this.loginAccount}/>
                <p id={"errorLabel"}>{this.state.message}</p>
                <StyledInput value="Go Register" type="button" id="registerButton" onClick={()=>this.redirect("/register")}/>
            </StyledDiv>
        );
    }
}

// @ts-ignore
export default withRouter(LoginPage)