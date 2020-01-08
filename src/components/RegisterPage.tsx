import React from "react";
import RegisterForm from "./RegisterForm";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class RegisterPage extends React.Component{

    redirect(path:string){
        // @ts-ignore
        this.props.history.push(path);
    };

    registerAccount = (login: string, password: string)=>{
        return AccountService.addOne(new AccountModel({"login": login, "password": password}))
            ?.then(r => {
            if(r !== undefined){
                this.redirect("/login");
            }
            else{
                this.setState({"message": "error"})
            }
        })?.catch((error)=>this.setState({"message": error.toString()}));
    };

    render = ()=>{

        const RegisterDiv = styled.div`
            width: 300px;
            height: 300px;
            border-radius: 30px;
            background-color: lightgray;
            padding: 30px;
        `;

        return (
            <RegisterDiv>
                <RegisterForm registerFunction={this.registerAccount}/>
                <p id="messageLabel">{
                    // @ts-ignore
                    this?.state?.message}</p>
            </RegisterDiv>
        )
    }
}

// @ts-ignore
export default withRouter(RegisterPage)