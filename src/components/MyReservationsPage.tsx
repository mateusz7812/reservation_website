import React, {Component} from "react";
import CookieService from "../services/CookieService";
import AccountModel from "../dataModels/AccountModel";
import ReservationModel from "../dataModels/ReservationModel";
import {ReservableModel} from "../dataModels/ReservableModel";
import EventModel from "../dataModels/EventModel";
import ReservationService from "../services/ReservationService";
import EventService from "../services/EventService";
import ReservableService from "../services/ReservableService";
import ReservationLabel from "./itemView/ReservationLabel";
import UserInterface from "./UserInterface";
import AccountService from "../services/AccountService";

class MyReservationsPage extends Component<{}, {
    account: AccountModel | undefined, reservations: Map<string, ReservationModel>, reservables: Map<string, ReservableModel>, events: Map<string, EventModel>
} >{
    state = {account: CookieService.getAccount(), reservations: new Map<string, ReservationModel>(), reservables: new Map<string, ReservableModel>(), events: new Map<string, EventModel>()};

    componentDidMount(): void {
        // eslint-disable-next-line no-unused-expressions
        this.loadAccount(this.loadReservationsWithEventsAndReservables);
    }

    loadAccount = (callback: ()=>void) => {
        // eslint-disable-next-line no-unused-expressions
        AccountService.getById(this.state.account?.id as string)?.then((account: AccountModel) => {
            this.setState({account: account}, callback);
        })
    };

    loadReservationsWithEventsAndReservables = () => {
        if(this.state.account !== undefined){
            // @ts-ignore
            // eslint-disable-next-line no-unused-expressions
            return this.state.account.reservations?.forEach((reservationId: string)=>
                 ReservationService.getById(reservationId)?.then((reservation: ReservationModel | undefined)=>
                {
                    if(reservation !== undefined){
                        this.state.reservations.set(reservation.id as string, reservation);
                        this.setState({reservations: this.state.reservations},
                            ()=>{
                                this.loadEvent(reservation.event as string);
                                this.loadReservable(reservation.reservable as string);
                            });
                    }
                })
            )
        }
    };

    loadEvent = (eventId: string) => {
        // eslint-disable-next-line no-unused-expressions
       EventService.getById(eventId)?.then((event: EventModel | undefined)=>{
           if(event !== undefined){
               this.state.events.set(event.id as string, event);
               this.setState({events: this.state.events});
           }
       })
    };

    loadReservable = (reservableId: string) => {
       // eslint-disable-next-line no-unused-expressions
       ReservableService.getById(reservableId)?.then((reservable: ReservableModel | undefined)=>{
           if(reservable !== undefined){
               this.state.reservables.set(reservable.id as string, reservable);
               this.setState({reservables: this.state.reservables});
           }
       })
   };

    render(){
        return(
        <UserInterface>
            {
                this.state.account !== undefined
                    // @ts-ignore
                ? this.state.account.reservations?.length !== 0
                    ?this.state.account.reservations?.map((reservationId: string)=>
                    {
                        let reservation = this.state.reservations.get(reservationId) as ReservationModel;
                        let event = this.state.events.get(reservation?.event as string) as EventModel;
                        let reservable = this.state.reservables.get(reservation?.reservable as string) as ReservableModel;
                        return <ReservationLabel key={reservationId+"label"} reservation={reservation} account={this.state.account} event={event} reservable={reservable}/>
                    })
                    : <p> not found any reservations</p>
                : <p>loading</p>
            }
        </UserInterface>
        );
    }
}

export default MyReservationsPage;