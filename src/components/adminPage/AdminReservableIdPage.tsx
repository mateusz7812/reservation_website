import React, {Component} from "react";
import EventModel from "../../dataModels/EventModel";
import {AdminSubpageDiv} from "./AdminPage";
import {ReservableModel} from "../../dataModels/ReservableModel";
import EventService from "../../services/EventService";
import ReservableService from "../../services/ReservableService";
import ReservableLabel from "../itemView/ReservableLabel";
import EventLabel from "../itemView/EventLabel";

class AdminReservableIdPage extends Component<{}, {
    events: EventModel[], reservable: ReservableModel|undefined
}> {
    state = {reservable: undefined, events: []};
    reservable_id: string|undefined = undefined;

    constructor(props: any) {
        super(props);
        this.reservable_id = props.match.params.id;
    }

    componentDidMount() {
        this.loadReservable();
    }

    loadEvents = () => {
        if (this.state.reservable !== undefined) {
            // @ts-ignore
            this.state.reservable.events.map((event_id: string)=>
                EventService.getById(event_id)?.then((event: EventModel| undefined) => {
                    if(event !== undefined){
                        // @ts-ignore
                        this.state.events.push(event);
                        this.setState({events: this.state.events});
                    }
                    return;
                })
            );
        }
    };

    loadReservable = () => {
        if (this.reservable_id != null) {
            // eslint-disable-next-line no-unused-expressions
            ReservableService.getById(this.reservable_id)?.then((reservable: ReservableModel| undefined) => this.setState({reservable: reservable}, this.loadEvents))
        }
    };

    render() {
        return (
            <AdminSubpageDiv>
                {
                    this.state.reservable === undefined
                        ? null
                        : <>
                            <ReservableLabel
                                // @ts-ignore
                                reservableModel={this.state.reservable}/>
                            <p>Events:</p>
                            {
                                this.state.events.map((event)=><EventLabel
                                    // @ts-ignore
                                    key={event.id}
                                    event={event}/>)
                            }
                        </>
                }
            </AdminSubpageDiv>
        );
    }
}

export default AdminReservableIdPage;