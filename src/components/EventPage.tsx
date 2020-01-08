import React, {Component} from "react";
import EventView from "./itemView/EventView";
import ReservationManager from "./reservationManager/UserAddReservationManager";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";
import ReservableService from "../services/ReservableService";
import UserAddReservationManager from "./reservationManager/UserAddReservationManager";


class EventPage extends Component{
    private readonly event_id: string;
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
        return(
            <div>
                {
                    this.state.event === undefined ? null : <>
                        <EventView event={this.state.event} onClick={() => undefined}/>

                        <UserAddReservationManager eventId={this.event_id}/>

                    </>}
            </div>
        );
    }

}

export default EventPage;