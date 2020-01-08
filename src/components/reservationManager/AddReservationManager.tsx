import React, {Component} from "react";
import {ReservableModel, SpaceModel} from "../../dataModels/ReservableModel";
import ReservationModel from "../../dataModels/ReservationModel";
import ReservableView from "../itemView/ReservableView";
import SelectedReservablesList from "./SelectedReservablesList";
import { withRouter } from "react-router-dom";
import AccountList from "../AccountList";
import EventList from "../EventList";
import EventService from "../../services/EventService";
import EventModel from "../../dataModels/EventModel";
import ReservableService from "../../services/ReservableService";
import AccountService from "../../services/AccountService";
import AccountModel from "../../dataModels/AccountModel";

class AddReservationManager extends Component{
    state={loadedAccounts:{}, loadedEvents:{}, loadedReservables:{}, reservableId: undefined, selectedReservablesIds: Array<string>(), accountId: undefined, eventId: undefined};

    constructor(props: any) {
        super(props);
        this.state.eventId = props.eventId;
        this.state.accountId = props.accountId;
        if(this.state.accountId === undefined)
            this.loadAccounts();
        if(this.state.eventId === undefined)
            this.loadEvents();
    }

    loadReservables = ()=>{
        // @ts-ignore
        let reservablePromise = ReservableService.getById(this.state.reservableId);
        this._loadReservables(reservablePromise);
    };

    _loadReservables = (promise: Promise<ReservableModel|undefined>|undefined) => {
        // eslint-disable-next-line no-unused-expressions
        promise?.then((r: ReservableModel|undefined)=>{
            if(r!== undefined){
                // @ts-ignore
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.loadedReservables[r.id] = r;
                this.setState(this.state);
                if(r.type === "Space"){
                    (r as SpaceModel).getReservables().forEach(this._loadReservables);
                }
            }
        });
    };

    changeSelection = (reservableId: string)=> {
        if (this.state.selectedReservablesIds.includes(reservableId)) {
            const indexOf = this.state.selectedReservablesIds.indexOf(reservableId);
            this.state.selectedReservablesIds.splice(indexOf, 1);
        } else {
            this.state.selectedReservablesIds.push(reservableId);
        }
        this.setState({selectedReservablesIds: this.state.selectedReservablesIds});
    };

    makeReservation = ()=>{
        let reservationsToAdd = this.state.selectedReservablesIds.map((reservableId: string)=>
            new ReservationModel({
                "account": this.state.accountId,
                "event": this.state.eventId,
                // @ts-ignore
                "reservable": {"type": this.state.loadedReservables[reservableId].type, "id": reservableId}
            })
        );
        // @ts-ignore
        this.props.history.push("/reserving", {reservationsToAdd: reservationsToAdd, allReservables: this.state.loadedReservables, redirectPath: this.props.redirectPath});
    };

    loadEvent = () => {
        // @ts-ignore
        return EventService.getById(this.state.eventId)?.then((event: EventModel) => this.setState({"reservableId" : event.reservable?.id}));
    };

    loadAccounts = ()=>{
        return AccountService.getAll()?.then((accounts: AccountModel[] | undefined) => {
            let accountsDict:{[key: string]: AccountModel} = {};
            // eslint-disable-next-line no-unused-expressions
            accounts?.map((account)=>accountsDict[account.id as string] = account);
            this.setState({loadedAccounts: accountsDict});
        });
    };

    loadEvents = ()=>{
        return EventService.getAll()?.then((events: EventModel[] | undefined) => {
            let eventsDict:{[key: string]: EventModel} = {};
            // eslint-disable-next-line no-unused-expressions
            events?.map((event)=>eventsDict[event.id as string] = event);
            this.setState({loadedEvents: eventsDict});
        });
    };

    setAccountId = (accountId: string)=>this.setState({"accountId": accountId});
    setEventId = (eventId: string)=>this.setState({"eventId": eventId});

    render(){
        if(this.state.accountId === undefined){
            return(
                <div id="reservationManager">
                    <AccountList
                        // @ts-ignore
                        accounts={this.state.loadedAccounts} callWithId={this.setAccountId}/>
                </div>
            );
        }
        else if(this.state.eventId === undefined){
            return(
                <div id="reservationManager">
                    <EventList
                        // @ts-ignore
                        events={this.state.loadedEvents} callWithId={this.setEventId}/>
                </div>
            );
        }
        else if(this.state.reservableId === undefined) {
            // eslint-disable-next-line no-unused-expressions
            this.loadEvent()?.then(()=> this.loadReservables());
            return(
                <div id="reservationManager">
                    <p>loading</p>
                </div>
            )
        }
        else{
            return(
                <div id="reservationManager">
                    <div>
                        {
                            // @ts-ignore
                            <ReservableView reservableId={this.state.reservableId} allReservables={this.state.loadedReservables} callWithId={this.changeSelection}/>
                        }
                    </div>
                    <SelectedReservablesList selectedReservablesIds={this.state.selectedReservablesIds} allReservables={this.state.loadedReservables} selectionChanger={this.changeSelection}/>
                    <input id="reserveButton" type="button" onClick={this.makeReservation}/>
                </div>
            )
        }

    }
}

// @ts-ignore
export default withRouter(AddReservationManager);