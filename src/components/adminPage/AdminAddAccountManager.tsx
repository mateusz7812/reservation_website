import React, {Component} from "react";
import AccountModel from "../../dataModels/AccountModel";
import AddAccountManager from "../AddAccountManager";
import {withRouter} from "react-router-dom";
import styled from "styled-components";


class AdminAddAccountManager extends Component {
    addAccount = (account: AccountModel)=> {
        let accountsToAdd = [account];
        // @ts-ignore
        this.props.history.push("/adding/account", {accountsToAdd: accountsToAdd, redirectPath: "/admin/account"});
    };

    render(){
        let StyledDiv = styled.div`
            width: 30%;
            margin: 30px auto;
            background-color: white;
            padding: 20px 40px;
            box-shadow: 0 0 5px black;
        `;

        return (
            <StyledDiv>
                <h3>New account</h3>
                <AddAccountManager callWithNewAccount={this.addAccount}/>
            </StyledDiv>
        );
    }
}

// @ts-ignore
export default withRouter(AdminAddAccountManager);