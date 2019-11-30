import React, {useRef} from "react";

const RegisterForm = ({registerFunction}) => {
    let login = useRef();
    let password = useRef();

    return(
        <div>
            <input type="text" id="loginInput" ref={login} />
            <input type="password" id="passwordInput" ref={password}/>
            <button id="registerButton" onClick={() => registerFunction(login.current.value, password.current.value)}/>
        </div>
    )
};

export default RegisterForm;