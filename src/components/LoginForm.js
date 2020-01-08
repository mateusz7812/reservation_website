import React, {useRef} from "react";
import {StyledInput} from "./StyledComponents";
import styled from "styled-components";

const LoginForm = ({loginFunction}) =>{

    let login = useRef();
    let password = useRef();


    const StyledDiv = styled.div`
        width: 80%;
        margin: auto 50px;
    `;

    return(
        <StyledDiv>
            <label>
                Login:
                <input type="text" id="loginInput" ref={login} />
            </label>
            <label>
                Password:
                <input type="password" id="passwordInput" ref={password}/>
            </label>
            <StyledInput type="button" value="Login" id="loginButton" onClick={() => loginFunction(login.current.value, password.current.value)}/>
        </StyledDiv>
   )
};

export default LoginForm