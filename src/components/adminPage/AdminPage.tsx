import React, {Component} from "react";
import AdminMenu from "./AdminMenu";
import {withRouter, Route, Switch, Redirect} from "react-router-dom";
import EventAdminPage from "./EventAdminPage";
import AccountAdminPage from "./AccountAdminPage";
import ReservableAdminPage from "./ReservableAdminPage";
import ReservationAdminPage from "./ReservationAdminPage";
import styled from "styled-components";

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