import React from "react";
import RegisterForm from "./RegisterForm";
import {addAccount} from "../domain/ApiRequests";
import {Redirect} from "react-router-dom";

class RegisterPage extends React.Component{

    registerAccount(login, password){
        return addAccount().then(r => {
            if(r.status === 200){
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