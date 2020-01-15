import React, {Component} from "react";
import AccountModel from "../../dataModels/AccountModel";
import AddAccountForm from "../AddAccountForm";
import {withRouter} from "react-router-dom";


class AdminAddAccountManager extends Component {
    addAccount = (account: AccountModel)=> {
        let accountsToAdd = [account];
        // @ts-ignore
        this.props.history.push("/adding/account", {accountsToAdd: accountsToAdd, redirectPath: "/admin/account"});
    };

    render(){
        return (
            <div>
                <AddAccountForm callWithNewAccount={this.addAccount}/>
            </div>
        );
    }
}

// @ts-ignore
export default withRouter(AdminAddAccountManager);