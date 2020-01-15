import React from "react";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import UserAddAccountManager from "./UserAddAccountManager";
import {StyledInput} from "./StyledComponents";

class RegisterPage extends React.Component{

    redirect(path:string){
        // @ts-ignore
        this.props.history.push(path);
    };

    registerAccount = (account: AccountModel)=>{
        return AccountService.addOne(account)
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
                <UserAddAccountManager addAccount={this.registerAccount}/>
                <p id="messageLabel">{
                    // @ts-ignore
                    this?.state?.message}</p>
                <StyledInput type={"button"} id={"backButton"} value={"Go Login"} onClick={()=>this.redirect("/login")}/>
            </RegisterDiv>
        )
    }
}

// @ts-ignore
export default withRouter(RegisterPage)