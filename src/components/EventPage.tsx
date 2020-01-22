import React, {Component} from "react";
import EventLabel from "./itemView/EventLabel";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";
import UserAddReservationManager from "./reservationManager/UserAddReservationManager";
import styled from "styled-components";
import UserInterface from "./UserInterface";


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
        const EventDiv = styled.div`
            width: 20%;
            margin: 20px auto;
        `;

        return(
            <UserInterface>
                {
                    this.state.event === undefined ? null : <>
                        <EventDiv>
                            <EventLabel event={this.state.event} onClick={() => undefined}/>
                        </EventDiv>
                        <UserAddReservationManager eventId={this.event_id}/>

                    </>}
            </UserInterface>
        );
    }

}

export default EventPage;