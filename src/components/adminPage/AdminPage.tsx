import React, {Component} from "react";
import AdminMenu from "./AdminMenu";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import EventAdminPage from "./AdminEventPage";
import AccountAdminPage from "./AccountAdminPage";
import ReservableAdminPage from "./AdminReservablePage";
import ReservationAdminPage from "./AdminReservationPage";
import styled from "styled-components";
import AdminAccountIdPage from "./AdminAccountIdPage";
import AdminEventIdPage from "./AdminEventIdPage";
import AdminReservationIdPage from "./AdminReservationIdPage";
import AdminReservableIdPage from "./AdminReservableIdPage";

export let MenuDiv = styled.div`
    float: left;
    border: 1px solid red;
    width: 20%;
    box-sizing: border-box;
`;

export let AdminSubpageDiv = styled.div`
    float: left;
    border: 1px solid blue;
    width: 80%;
    box-sizing: border-box;
`;

let AdminPageDiv = styled.div`
    width: 80%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
`;

class AdminPage extends Component{
    redirectTo = (path: string)=>{
        // @ts-ignore
        this.props.history.push(path);
    };

    render=()=>{
       return(
           <AdminPageDiv>
                <AdminMenu redirectTo={this.redirectTo}/>
                <Switch>
                    <Route path="/admin/event/:id" component={AdminEventIdPage}/>
                    <Route path="/admin/event" component={EventAdminPage}/>
                    <Route path="/admin/account/:id" component={AdminAccountIdPage}/>
                    <Route path="/admin/account" component={AccountAdminPage}/>
                    <Route path="/admin/reservable/:id" component={AdminReservableIdPage}/>
                    <Route path="/admin/reservable" component={ReservableAdminPage}/>
                    <Route path="/admin/reservation/:id" component={AdminReservationIdPage}/>
                    <Route path="/admin/reservation" component={ReservationAdminPage}/>
                    <Redirect to={"/admin/reservation"} />
                </Switch>
           </AdminPageDiv>
       );
    }
}


// @ts-ignore
export default withRouter(AdminPage);