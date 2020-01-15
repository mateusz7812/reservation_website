import React, {useRef} from "react";
import {StyledInput} from "./StyledComponents";
import styled from "styled-components";
import AccountModel from "../dataModels/AccountModel";

const AddAccountForm = ({account, callWithNewAccount}: {account?: AccountModel, callWithNewAccount: (account: AccountModel)=> void}) => {
    let login = useRef(null);
    let password = useRef(null);
    let roles = useRef(null);

    const StyledLabel = styled.label`
        white-space: nowrap;
    `;

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
            {
                account?.roles === undefined
                    ? <StyledLabel>
                            Roles:
                            <select multiple={true} id={"roleInput"} ref={roles}>
                                <option value={"ROLE_ADMIN"}>Admin</option>
                            </select>
                        </StyledLabel>
                    : null
            }
            <StyledInput type="button" value="Add account" id="addButton" onClick={() => callWithNewAccount(getAccountModel())}/>
        </div>
    )
};

export default AddAccountForm;