import React, {useRef} from "react";
import {StyledButtonInput} from "./StyledComponents";
import styled from "styled-components";
import AccountModel from "../dataModels/AccountModel";

const AddAccountManager = ({account, callWithNewAccount}: {account?: AccountModel, callWithNewAccount: (account: AccountModel)=> void}) => {
    let login = useRef(null);
    let password = useRef(null);
    let roles = useRef(null);


    function getAccountModel() {
        // @ts-ignore
        const getRolesArray = () =>{
            // @ts-ignore
            let options = roles.current.options;
            let value = [];
            let i = 0, l = options.length;
            for (; i < l; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
            }
            return value;
        };

        if(account === undefined) account = new AccountModel();

        if(account.login === undefined) {
            // @ts-ignore
            account.login = login.current?.value;
        }
        if(account.password === undefined) {
            // @ts-ignore
            account.password = password.current?.value;
        }
        if(account.roles === undefined) {
            // @ts-ignore
            account.roles = getRolesArray();
        }

        return account;
    }

    const StyledLabel = styled.label`
        height: 30px;
        display: block;
        white-space: nowrap;
        text-align: left;
        margin: 3px 0;
    `;

    const Input = styled.input`
        float: right;
    `;

    const Button = styled(StyledButtonInput)`
        margin: 10px auto;
    `;

    const StyledDiv = styled.div`
        margin: 20px 0;
        clear: both;
        width: 100%;
        text-align:center;
    `;

    const StyledSelect = styled.select`
        display: block;
        height: 40px;
        float: right;
    `;

    const StyledOption = styled.option`
        width: 80px;
        text-align: center;
    `;

    return(
        <div>
            <StyledLabel>
                Login:
                <Input type="text" id="loginInput" ref={login} />
            </StyledLabel>
            <StyledLabel>
                Password:
                <Input type="password" id="passwordInput" ref={password}/>
            </StyledLabel>
            {
                account?.roles === undefined
                    ? <StyledLabel>
                            Roles:
                            <StyledSelect multiple={true} id={"roleInput"} ref={roles}>
                                <StyledOption value={"ROLE_ADMIN"}>Admin</StyledOption>
                            </StyledSelect>
                        </StyledLabel>
                    : null
            }
            <StyledDiv>
                <Button type="button" value="Add account" id="addButton" onClick={() => callWithNewAccount(getAccountModel())}/>
            </StyledDiv>
        </div>
    )
};

export default AddAccountManager;