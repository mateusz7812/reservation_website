import React, {Component} from "react";
import EventView from "./EventView";
import ReservationManager from "./ReservationManager";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";
import {ReservableModel, SeatModel} from "../dataModels/ReservableModel";
import ReservableService from "../services/ReservableService";
import SelectedReservablesList from "./SelectedReservablesList";


class EventPage extends Component{
    private event_id: string;
    state:{event: EventModel|undefined} = {
        event: undefined
    };

    constructor(props: any) {
        super(props);
        this.event_id = props.match.params.id;
    }

    componentDidMount() {
        this.loadEvent();
    }

    loadEvent() {
        // eslint-disable-next-line no-unused-expressions
        EventService.getById(this.event_id)
            ?.then((event)=>{
                if(event !== undefined){
                    this.setState({event: event});
                }
            })
    }

    render(){
        const id = this.state.event?.reservable?.id;
        return(
            <div>
                {
                    this.state.event === undefined ? null : <>
                        <EventView event={this.state.event} onClick={() => undefined}/>

                        <ReservationManager
                            // @ts-ignore
                            reservablePromise={ReservableService.getById(id)} />

                    </>}
            </div>
        );
    }

}

export default EventPage;