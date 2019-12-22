import React from "react";
import EventModel from "../dataModels/EventModel";

const EventView = ({event, onClick}: {event: EventModel, onClick: ()=>undefined})=>{

    return(
        <div className="eventView" onClick={onClick}>
            <p key={
                // @ts-ignore
                event?.id?.toString()+"name"
            }>{event?.name}</p>
            <p key={
                // @ts-ignore
                event?.id?.toString() +"startDate"
            }>{event?.startDate}</p>
        </div>
    );

};

export default EventView;