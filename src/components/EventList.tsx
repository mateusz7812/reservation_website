import React from "react";
import EventLabel from "./itemView/EventLabel";
import EventModel from "../dataModels/EventModel";

const EventList = ({events, callWithId}:{events: {[key:string]:EventModel}, callWithId:(_:string)=>void})=>{
    return(
        <div id="eventsList">
            {
                 Object.keys(events).map((eventId: string)=> {
                     return <EventLabel key={eventId} onClick={()=>callWithId(eventId)} event={events[eventId]} />;
                 })
            }
        </div>
    )
};

// @ts-ignore
export default EventList;