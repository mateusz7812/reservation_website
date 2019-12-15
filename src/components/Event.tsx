import React from "react";
import EventModel from "../dataModels/Event";
import {Link} from "react-router-dom";

const Event = ({event}: {event: EventModel})=>{
    return(
        <Link to={"/event/"+event.id}>
            <div>
                <p key={
                    // @ts-ignore
                    event.id.toString()+"name"
                }>{event.name}</p>
                <p key={
                    // @ts-ignore
                    event.id.toString() +"startDate"
                }>{event.startDate}</p>
            </div>
        </Link>
    );
};

export default Event;