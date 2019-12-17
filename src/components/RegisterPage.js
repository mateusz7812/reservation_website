import React from "react";
import RegisterForm from "./RegisterForm";
import {Redirect} from "react-router-dom";
import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";

class RegisterPage extends React.Component{

    registerAccount(login, password){
        return AccountService.addOne(new AccountModel({"login": login, "password": password})).then(r => {
            if(r !== undefined){
                return <Redirect to='/login'/>;
            }
            else{
                this.setState({"message": "error"})
            }
        });
    };

    render() {
        return (
            <div>
                <RegisterForm registerFunction={this.registerAccount}/>
            </div>
        )
    }
}

export default RegisterPage