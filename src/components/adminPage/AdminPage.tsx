import React, {Component} from "react";
import AdminMenu from "./AdminMenu";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import EventAdminPage from "./AdminEventPage";
import AccountAdminPage from "./AccountAdminPage";
import ReservableAdminPage from "./AdminReservablePage";
import ReservationAdminPage from "./AdminReservationPage";
import styled from "styled-components";

export let MenuDiv = styled.div`
    float: left;
    width: 20%;
    box-sizing: border-box;
`;

export let AdminSubpageDiv = styled.div`
    float: right;
    width: 78%;
    box-sizing: border-box;
`;

let AdminPageDiv = styled.div`
    width: 70%;
    min-width: 600px;
    margin: 20px auto;
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
                    <Route path="/admin/event" component={EventAdminPage}/>
                    <Route path="/admin/account" component={AccountAdminPage}/>
                    <Route path="/admin/reservable" component={ReservableAdminPage}/>
                    <Route path="/admin/reservation" component={ReservationAdminPage}/>
                    <Redirect to={"/admin/reservation"} />
                </Switch>
           </AdminPageDiv>
       );
    }
}


// @ts-ignore
export default withRouter(AdminPage);