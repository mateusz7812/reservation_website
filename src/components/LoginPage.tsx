import React from "react";
import {withRouter} from "react-router-dom";
import CookieService from "../services/CookieService";
import LoginForm from "./LoginForm";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import styled from "styled-components";
import {StyledButtonInput} from "./StyledComponents";
import {AxiosError} from "axios";


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
         )?.catch((error:AxiosError)=>this.setState({"message": error.message}));
    };

    render = ()=>{

        const StyledDiv = styled.div`
            width: 300px;
            height: 220px;
            padding: 10px;        
            background-color: white;
            box-shadow: 0 0 5px black;
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            `;

        const Button = styled(StyledButtonInput)`
        margin: 30px auto;
    `;

        return(
            <StyledDiv>
                <LoginForm loginFunction={this.loginAccount}/>
                <p id={"errorLabel"}>{this.state.message}</p>
                <Button value="Go Register" type="button" id="registerButton" onClick={()=>this.redirect("/register")}/>
            </StyledDiv>
        );
    }
}

// @ts-ignore
export default withRouter(LoginPage)