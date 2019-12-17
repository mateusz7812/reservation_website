import React, {Component} from "react";
import EventList from "./EventList";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";

class HomePage extends Component{
    state = {events:[]};

    componentDidMount() {
        // eslint-disable-next-line no-unused-expressions
        EventService.getAll()?.then((events: EventModel[]|undefined) =>
            {
                if(events !== undefined){
                    this.setState({"events": events})
                }
            }
        )

    }

    render() {
        return(
            <div>
            <EventList events={
                this.state.events
            }/>
        </div>
        )
    };
}
export default HomePage