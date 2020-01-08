import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import { Route, withRouter, Switch } from "react-router-dom";
import ReservationList from "../ReservationList";
import AdminAddReservationManager from "./AdminAddReservationManager";
import ReservationService from "../../services/ReservationService";
import ReservationModel from "../../dataModels/ReservationModel";
import AccountService from "../../services/AccountService";
import {ReservableModel} from "../../dataModels/ReservableModel";
import AccountModel from "../../dataModels/AccountModel";
import EventModel from "../../dataModels/EventModel";
import EventService from "../../services/EventService";
import ReservableService from "../../services/ReservableService";

class ReservationAdminPage extends React.Component{
    state:{reservations: {[key: string]: ReservationModel}, accounts: {[key: string]: AccountModel},
        events: {[key: string]: EventModel}, reservables: {[key: string]: ReservableModel}} =
        {reservations:{}, accounts:{}, events:{}, reservables:{}};

    constructor(props: any) {
        super(props);
        // eslint-disable-next-line no-unused-expressions
        this.loadReservations()
            ?.then(()=>{
                this.loadAccounts();
                this.loadEvents();
                this.loadReservables();
            });
    }

    redirect = (path:string)=>{
        // @ts-ignore
        this.props.history.push(path);
    };

    loadReservations = () => {
        // eslint-disable-next-line no-unused-expressions
        return ReservationService.getAll()?.then((loadedReservations: ReservationModel[] | undefined) => {
            // eslint-disable-next-line no-unused-expressions
            loadedReservations?.forEach((reservation: ReservationModel) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.reservations[reservation.id as string] = reservation;
                this.setState({reservations: this.state.reservations});
            })
        });
    };

    loadAccounts = () => {
        return Object.keys(this.state.reservations).forEach((reservationId: string)=> {
            const accountId = this.state.reservations[reservationId].account;
            if(accountId !== undefined){
                // eslint-disable-next-line no-unused-expressions
                AccountService.getById(accountId)?.then((account: AccountModel)=>{
                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.state.accounts[account.id as string] = account;
                    this.setState({accounts: this.state.accounts});
                })
            }
        })
    };

    loadEvents = () => {
        return Object.keys(this.state.reservations).forEach((reservationId: string)=> {
            const eventId = this.state.reservations[reservationId].event;
            if(eventId !== undefined){
                // eslint-disable-next-line no-unused-expressions
                EventService.getById(eventId)?.then((event: EventModel | undefined)=>{
                    if(event !== undefined){
                        // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.events[event.id as string] = event;
                        this.setState({events: this.state.events});
                    }})
            }
        })
    };

    loadReservables = () => {
        return Object.keys(this.state.reservations).forEach((reservationId: string)=> {
            const reservableId = this.state.reservations[reservationId].reservable?.id;
            if(reservableId !== undefined){
                // eslint-disable-next-line no-unused-expressions
                ReservableService.getById(reservableId)?.then((reservable: ReservableModel | undefined)=>{
                    if(reservable !== undefined){
                        // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.reservables[reservable.id as string] = reservable;
                        this.setState({events: this.state.events});
                    }
                })
            }
        })
    };

    render(){
        return(
            <AdminSubpageDiv>
                {
                    // @ts-ignore
                    this.props.location.pathname.includes("/admin/reservations/add")
                        ? null
                        : <input id="addButton" type="button" value="Add Reservation" onClick={() => this.redirect("/admin/reservation/add")}/>
                }
                <Switch>
                    <Route path="/admin/reservation/add" component={AdminAddReservationManager}/>
                    <Route path="/admin/reservation" component={()=> <ReservationList reservations={this.state.reservations} accounts={this.state.accounts} events={this.state.events} reservables={this.state.reservables}/>}/>
                </Switch>
            </AdminSubpageDiv>
        );
    }

}

// @ts-ignore
export default withRouter(ReservationAdminPage);