import React from "react";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import UserAddAccountManager from "./UserAddAccountManager";
import {StyledButtonInput} from "./StyledComponents";

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

        const Button = styled(StyledButtonInput)`
        margin: 10px auto 30px auto;
    `;

        const RegisterDiv = styled.div`
            box-sizing: border-box;
            width: 330px;
            height: 240px;
            background-color: white;
            padding: 40px;
            box-shadow: 0px 0px 5px black;
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;

        return (
            <RegisterDiv>
                <UserAddAccountManager addAccount={this.registerAccount}/>
                <p id="messageLabel">{
                    // @ts-ignore
                    this?.state?.message}</p>
                <Button type={"button"} id={"backButton"} value={"Go Login"} onClick={()=>this.redirect("/login")}/>
            </RegisterDiv>
        )
    }
}

// @ts-ignore
export default withRouter(RegisterPage)