import React from "react";
import EventView from "./itemView/EventView";
import EventModel from "../dataModels/EventModel";

const EventList = ({events, callWithId}:{events: {[key:string]:EventModel}, callWithId:(_:string)=>void})=>{
    return(
        <div id="eventsList">
            {
                 Object.keys(events).map((eventId: string)=> {
                     return <EventView key={eventId} onClick={()=>callWithId(eventId)} event={events[eventId]} />;
                 })
            }
        </div>
    )
};

// @ts-ignore
export default EventList;