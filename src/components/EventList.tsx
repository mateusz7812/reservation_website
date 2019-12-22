import React from "react";
import EventView from "./EventView";
import EventModel from "../dataModels/EventModel";
import { withRouter, useHistory } from "react-router-dom";

const EventList = ({events}:{events: EventModel[]})=>{

    let history = useHistory();
    const redirect = (eventId:string)=>{
        history.push("/event/"+eventId);
    };

    return(
        <div id="eventsList">
            {
                 events.map((event: EventModel)=> {
                     // @ts-ignore
                     return <EventView key={event.id} onClick={()=>redirect(event.id)} event={event} />;
                 })
            }
        </div>
    )
};

// @ts-ignore
export default withRouter(EventList);