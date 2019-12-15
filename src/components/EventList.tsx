import React from "react";
import Event from "./Event";
import EventModel from "../dataModels/Event";

const EventList = ({events}:{events: EventModel[]})=>{
    return(
        <div>
            {
                 events.map((event: EventModel)=> {
                     return <Event key={event.id} event={event} />;
                 })
            }
        </div>
    )
};

export default EventList;