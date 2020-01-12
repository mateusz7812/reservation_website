import React, {Component} from "react";
import AddEventForm from "./AddEventForm";
import EventModel from "../../dataModels/EventModel";
import ReservableList from "../ReservableList";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableService from "../../services/ReservableService";
import { withRouter } from "react-router-dom";

class AdminAddEventManager extends Component {
    state: { event: EventModel | undefined, allReservables: { [key: string]: ReservableModel }} = {
        event: undefined,
        allReservables: {}
    };

    componentDidMount(): void {
        this.loadReservables();
    }

    loadReservables = () => {
        // eslint-disable-next-line no-unused-expressions
        ReservableService.getAll()
            ?.then((reservables: ReservableModel[] | undefined) =>
            {
                // eslint-disable-next-line no-unused-expressions
                reservables?.map((reservable) =>
                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.state.allReservables[reservable.id as string] = reservable);
                this.setState({allReservables: this.state.allReservables});
            })
    };

    setEvent = (event: EventModel): void => {
        this.setState({"event": event});
        return;
    };

    setReservable = (reservableId: string) => {
        // @ts-ignore
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.event.reservable = reservableId;
        this.setState({event: this.state.event});
    };

    addEvent = () => {
        let eventsToAdd = [this.state.event];
        // @ts-ignore
        this.props.history.push("/adding/event", {eventsToAdd: eventsToAdd, allReservables: this.state.allReservables, redirectPath: "/admin/event"});
    };

    render() {
        return (
            <div>
                {
                    this.state.event === undefined
                        ? <AddEventForm callWithNewEvent={this.setEvent}/>
                        : this.state.event.reservable === undefined
                        ? <ReservableList reservables={this.state.allReservables} callWithId={this.setReservable}/>
                        : <input id="addButton" type="button" value="Add event" onClick={this.addEvent} />
                }
            </div>
        );
    }
}

// @ts-ignore
export default withRouter(AdminAddEventManager);