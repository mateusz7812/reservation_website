import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import {Route, Switch, withRouter} from "react-router-dom";
import AdminAddEventManager from "./AdminAddEventManager";
import EventList from "../EventList";
import AccountList from "../AccountList";
import EventService from "../../services/EventService";
import EventModel from "../../dataModels/EventModel";
import AccountService from "../../services/AccountService";
import AccountModel from "../../dataModels/AccountModel";

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
                <AccountList accounts={this.state.accounts} callWithId={this.redirect}/>
            </AdminSubpageDiv>
        );
    }
}

// @ts-ignore
export default withRouter(AccountAdminPage);