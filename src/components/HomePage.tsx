import React, {Component} from "react";
import EventList from "./EventList";
import EventService from "../services/EventService";
import Event from "../dataModels/Event";

class HomePage extends Component{
    state = {"events": []};

    componentDidMount() {
        // @ts-ignore
        EventService.getAll().then((events: Event[]|undefined) => {
            if(events !== undefined){
                this.setState({"events": events})
            }
        })
    }

    render() {
        return(
            <div>
            <EventList events={
                // @ts-ignore
                this.state.events
            }/>
        </div>
        )
    };
}
export default HomePage