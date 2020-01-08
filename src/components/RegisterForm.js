import React, {useRef} from "react";
import {StyledInput} from "./StyledComponents";
import styled from "styled-components";

const RegisterForm = ({registerFunction}) => {
    let login = useRef();
    let password = useRef();
    const StyledLabel = styled.label`
        white-space: nowrap;
    `;
    return(
        <div>
            <StyledLabel>
                Login:
                <input type="text" id="loginInput" ref={login} />
            </StyledLabel><br/>
            <StyledLabel>
                Password:
                <input type="password" id="passwordInput" ref={password}/>
            </StyledLabel>
            <StyledInput type="button" value="Register" id="registerButton" onClick={() => registerFunction(login.current.value, password.current.value)}/>
        </div>
    )
};

export default RegisterForm;