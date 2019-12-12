import React, {useRef} from "react";

const LoginForm = ({loginFunction}) =>{

    let login = useRef();
    let password = useRef();

    return(
        <div>
            <input type="text" id="loginInput" ref={login} />
            <input type="password" id="passwordInput" ref={password}/>
            <button id="loginButton" onClick={() => loginFunction(login.current.value, password.current.value)}/>
        </div>
   )
};

export default LoginForm