import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import {Route, Switch, withRouter} from "react-router-dom";
import AccountList from "../AccountList";
import AccountService from "../../services/AccountService";
import AccountModel from "../../dataModels/AccountModel";
import AdminAddAccountManager from "./AdminAddAccountManager";
import AdminAccountIdView from "./AdminAccountIdView";
import {StyledButtonInput} from "../StyledComponents";

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
                        : <StyledButtonInput id="addButton" type="button" value="Add Account" onClick={() => this.redirect("/admin/account/add")}/>
                }
                <Switch>
                    <Route path={"/admin/account/add"} component={AdminAddAccountManager}/>
                    <Route path={"/admin/account/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})"} component={(props: any)=> <AdminAccountIdView {...props} account={this.state.accounts[props.match.params.id]} />}/>
                    <Route path={"/admin/account/"} component={(props:any)=><AccountList {...props} accounts={this.state.accounts} callWithId={(id: string)=> this.redirect("/admin/account/" + id)}/>}/>
                </Switch>
            </AdminSubpageDiv>
        );
    }
}

// @ts-ignore
export default withRouter(AccountAdminPage);