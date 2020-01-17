import React, {Component} from "react";
import {ReservableModel, SpaceModel} from "../../dataModels/ReservableModel";
import ReservationModel from "../../dataModels/ReservationModel";
import {withRouter} from "react-router-dom";
import EventService from "../../services/EventService";
import EventModel from "../../dataModels/EventModel";
import ReservableService from "../../services/ReservableService";
import AccountService from "../../services/AccountService";
import AccountModel from "../../dataModels/AccountModel";
import {DataContext} from "./DataContext";
import AddReservationManagerView from "./AddReservationManagerView";

class AddReservationManager extends Component{
    state: {
            loadedAccounts:{[key: string]: AccountModel}, loadedEvents:{[key: string]: EventModel}, loadedReservables: Map<string, ReservableModel>,
            reservableId: string|undefined, accountId: string|undefined, eventId: string|undefined,
            selectedReservablesIds: string[], reservedReservables: string[]
        }= {
            loadedAccounts:{}, loadedEvents:{}, loadedReservables:new Map<string, ReservableModel>(),
            reservableId: undefined, accountId: undefined, eventId: undefined,
            selectedReservablesIds: [], reservedReservables: []
        };

    constructor(props: any) {
        super(props);
        this.state.eventId = props.eventId;
        this.state.accountId = props.accountId;
        if (this.state.accountId === undefined)
            this.loadAccounts();
        if (this.state.eventId === undefined)
            this.loadEvents();
        else {
            this.loadEventAndReservables();
        }
    }

    loadEventAndReservables = ()=>{
        // eslint-disable-next-line no-unused-expressions
        this.loadEvent()?.then(() => this.loadReservables()).then(() => this.addReservedToReservedList());
    };

    addReservedToReservedList = () => {
        this.state.loadedReservables.forEach((reservable)=>{
            this._addReservedToReservedList(reservable.id as string, false);
        })
    };

    _addReservedToReservedList = (reservableId: string, addAllToReserved: boolean) => {
        let reservable = this.state.loadedReservables.get(reservableId) as ReservableModel;
        if(addAllToReserved || this.checkIfReserved(reservableId)){
            this.state.reservedReservables.push(reservableId);
            this.setState({reservedReservables: this.state.reservedReservables});
            addAllToReserved = true;
        }
        if(reservable?.type === "Space") {
            // eslint-disable-next-line no-unused-expressions
            (reservable as SpaceModel).reservables?.forEach((reservable_id: string) => this._addReservedToReservedList(reservable_id, addAllToReserved));
        }
    };

    loadReservables = ()=>{
        // @ts-ignore
        let reservablePromise = ReservableService.getById(this.state.reservableId);
        return this._loadReservables(reservablePromise);
    };

    _loadReservables = (promise: Promise<ReservableModel|undefined>|undefined) => {
        // eslint-disable-next-line no-unused-expressions
        return promise?.then((r: ReservableModel|undefined)=>{
            if(r!== undefined){
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.loadedReservables.set(r.id as string, r);
                this.setState(this.state);
                if(r.type === "Space"){
                    return this.loadSpace(r);
                }
            }
            return;
        });
    };

    private loadSpace = (r: ReservableModel):  Promise<any> => {
        // eslint-disable-next-line no-unused-expressions
        return Promise.all([(r as SpaceModel).reservables
            ?.map((id: string)=> ReservableService.getById(id))
            .map((promise) => this._loadReservables(promise))]);
    };

    changeSelection = (reservableId: string)=> {
        const selectedIds = this.state.selectedReservablesIds;
        if (selectedIds.includes(reservableId)) {
            const indexOf = selectedIds.indexOf(reservableId);
            selectedIds.splice(indexOf, 1);
        } else {
            const parentSelected = this.checkIfParentSelected(reservableId);
            const reserved = this.state.reservedReservables.includes(reservableId);
            if(!(parentSelected || reserved)){
                        this.deleteChildrenFromSelected(reservableId);
                        selectedIds.push(reservableId);
                    }
        }
        this.setState({selectedReservablesIds: selectedIds});
    };

    private checkIfReserved(reservableId: string) {
        let event = this.state.loadedEvents[this.state.eventId as string];

        const filteredReservations = this.state.loadedReservables.get(reservableId)
                ?.reservations
                ?.filter((reservationId)=>
                    event.reservations?.includes(reservationId))
                ?? [];

        return filteredReservations.length !== 0;
    }

    checkIfParentSelected(reservableId: string){
        let parents = this.state.selectedReservablesIds
            .map((id)=> this.state.loadedReservables.get(id) as ReservableModel)
            .filter((reservable) => reservable.type === "Space")
            .filter((reservable) => (reservable as SpaceModel).reservables?.includes(reservableId));
        return parents.length !== 0;
    }
    
    deleteChildrenFromSelected(reservableId: string){
        let reservable = this.state.loadedReservables.get(reservableId) as ReservableModel;
        if(reservable.type === "Space"){
            // eslint-disable-next-line no-unused-expressions
            (reservable as SpaceModel).reservables?.forEach((childId) => this.deleteChildrenFromSelected(childId));
        }
        else {
            const selectedIds = this.state.selectedReservablesIds;
            if (selectedIds.includes(reservableId)) {
                const indexOf = selectedIds.indexOf(reservableId);
                selectedIds.splice(indexOf, 1);
            }
        }
    }

    makeReservation = ()=>{
        let reservationsToAdd = this.state.selectedReservablesIds.map((reservableId: string)=>
            new ReservationModel({
                "account": this.state.accountId,
                "event": this.state.eventId,
                "reservable": reservableId
            })
        );

        const map_to_obj = ( aMap: Map<string, Object>) => {
            const obj:{[key: string]: Object} = {};
            aMap.forEach ((v,k) => { obj[k] = v });
            return obj;
        };

        // @ts-ignore
        this.props.history.push("/adding/reservation", {reservationsToAdd: reservationsToAdd, allReservables: map_to_obj(this.state.loadedReservables), redirectPath: this.props.redirectPath});
    };

    loadEvent = () => {
        if(this.state.eventId !== undefined) {
            return EventService.getById(this.state.eventId)?.then((event: EventModel | undefined) => {
                if (event instanceof EventModel) {
                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.state.loadedEvents[event?.id as string] = event;
                    this.setState({loadedEvents: this.state.loadedEvents});
                    this.setState({reservableId: event.reservable});
                }
            });
        }
        return Promise.reject("eventiId undefined");
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

    setEventId = (eventId: string)=>{
        this.setState({"eventId": eventId}, this.loadEventAndReservables);
    };

    render(){
        return (
            <DataContext.Provider value={{
                allReservables: this.state.loadedReservables,
                selectedReservablesIds: this.state.selectedReservablesIds,
                reservedReservablesIds: this.state.reservedReservables,
                loadedAccounts: new Map(Object.entries(this.state.loadedAccounts)),
                loadedEvents: new Map(Object.entries(this.state.loadedEvents))
            }}>
                <AddReservationManagerView
                    accountId={this.state.accountId}
                    reservableId={this.state.reservableId}
                    eventId={this.state.eventId}
                    setAccountId={this.setAccountId}
                    setEventId={this.setEventId}
                    selectionChanger={this.changeSelection}
                    makeReservation={this.makeReservation}
                />
            </DataContext.Provider>
        );
    }

}

// @ts-ignore
export default withRouter(AddReservationManager);