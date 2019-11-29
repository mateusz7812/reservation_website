import React from "react";

const RegisterPage = () => {

    function callApi(){

    }

    return(
        <div>
            <input type="text" id="loginInput"/>
            <input type="password" id="passwordInput"/>
            <button id="registerButton" onClick={callApi}/>
        </div>
    )
};

export default RegisterPage;