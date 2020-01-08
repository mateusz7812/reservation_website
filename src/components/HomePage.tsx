import React, {Component} from "react";
import EventList from "./EventList";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";

class HomePage extends Component{
    state: {events:{[key: string]: EventModel}} = {events:{}};

    constructor(props: any) {
        super(props);
        this.loadEvents();
    }

    private loadEvents() {
        // eslint-disable-next-line no-unused-expressions
        EventService.getAll()?.then((events: EventModel[] | undefined) => {
                if (events !== undefined) {
                    let eventsDict: {[key:string]: EventModel} = {};
                    events.forEach((event: EventModel)=>eventsDict[event.id as string] = event);
                    this.setState({"events": eventsDict})
                }
            }
        )
    }

    redirectToEventPage = (eventId:string)=>{
        let path = "/event/" + eventId;
        // @ts-ignore
        this.props.history.push(path);
    };

    render() {
        return(
            <div>
                <EventList events={this.state.events} callWithId={this.redirectToEventPage}/>
            </div>
        )
    };
}
export default HomePage