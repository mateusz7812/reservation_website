import React, {useRef} from "react";
import {StyledButtonInput} from "./StyledComponents";
import styled from "styled-components";

const LoginForm = ({loginFunction}) =>{

    let login = useRef();
    let password = useRef();


    const StyledDiv = styled.div`
        width: 80%;
        margin: 30px auto;
    `;

    const Label = styled.label`
        display: block;
        text-align: left;
        margin: 10px auto;
    `;

    const TextInput = styled.input`
        float: right;
    `;


    const Button = styled(StyledButtonInput)`
        margin: 30px auto;
    `;

    return(
        <StyledDiv>
            <Label>
                Login:
                <TextInput type="text" id="loginInput" ref={login} />
            </Label>
            <Label>
                Password:
                <TextInput type="password" id="passwordInput" ref={password}/>
            </Label>
            <Button type="button" value="Login" id="loginButton" onClick={() => loginFunction(login.current.value, password.current.value)}/>
        </StyledDiv>
   )
};

export default LoginForm