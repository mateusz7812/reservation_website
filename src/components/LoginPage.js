import React from "react";
import {getTokenForAccount as apiLoginAccount} from "../domain/ApiRequests";
import {Redirect} from "react-router-dom";
import {addCookie} from "../services/CookieService";
import LoginForm from "./LoginForm";

class LoginPage extends React.Component{

    loginAccount(login, password) {
         return apiLoginAccount(login, password).then(r =>
         {
             if(r.status === 200){
                 addCookie("token", r.data["token"]);
                 return <Redirect to="/home"/>
             }
             else{
                 this.setState({"message": "error"})
             }
         });
    }

    render() {
        return(
            <LoginForm loginFunction={this.loginAccount}/>
        );
    }
}
export default LoginPage