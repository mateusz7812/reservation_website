import React, {Component} from "react";
import AccountModel from "../dataModels/AccountModel";
import AccountService from "../services/AccountService";
import AddAccountForm from "./AddAccountForm";

type func = (_: AccountModel)=>void;

class UserAddAccountManager extends Component<{addAccount?: func}> {
    addAccount = (account: AccountModel)=> {
        this.props.addAccount === undefined
            ? AccountService.addOne(account)
            : this.props.addAccount(account)
    };

    render(){
        return (
            <div>
                <AddAccountForm account={new AccountModel({roles: []})} callWithNewAccount={this.addAccount}/>
            </div>
        );
    }
}


export default UserAddAccountManager;