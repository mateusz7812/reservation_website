import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import {Route, Switch, withRouter} from "react-router-dom";
import AccountList from "../AccountList";
import AccountService from "../../services/AccountService";
import AccountModel from "../../dataModels/AccountModel";
import AdminAddAccountManager from "./AdminAddAccountManager";

class AccountAdminPage extends React.Component {
    state: {accounts:{[key: string]: AccountModel}} = {accounts: {}};

    componentDidMount(): void {
        this.loadAccounts();
    }

    loadAccounts = ()=>{
        // eslint-disable-next-line no-unused-expressions
        AccountService.getAll()
            ?.then((accounts: AccountModel[] | undefined)=>
                accounts?.map((account: AccountModel)=>{
                        // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.accounts[account.id as string] = account;
                        this.setState({accounts: this.state.accounts});
                    }
                )
            )
    };

    redirect = (path: string) => {
        // @ts-ignore
        this.props.history.push(path);
    };

    render() {
        return (
            <AdminSubpageDiv>
                {
                    // @ts-ignore
                    this.props.location.pathname.includes("/admin/account/add")
                        ? null
                        : <input id="addButton" type="button" value="Add Account" onClick={() => this.redirect("/admin/account/add")}/>
                }
                <Switch>
                    <Route path={"/admin/account/add"} component={AdminAddAccountManager}/>
                    <Route path={"/admin/account"} component={(props:any)=><AccountList {...props} accounts={this.state.accounts} callWithId={this.redirect}/>}/>
                </Switch>
            </AdminSubpageDiv>
        );
    }
}

// @ts-ignore
export default withRouter(AccountAdminPage);