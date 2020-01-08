import React from "react";
import EventModel from "../../dataModels/EventModel";
import styled from "styled-components";

const EventView = ({event, onClick}: {event: EventModel, onClick: ()=>void})=>{

    const EventDiv = styled.div`
        width: 100px;
        height: 100px;
        border: 1px solid black;
        border-radius: 10px;
        margin: 10px;
        float: left;
    `;
    return(
        <EventDiv className="eventView" onClick={onClick}>
            <p key={
                // @ts-ignore
                event?.id?.toString()+"name"
            }>{event?.name}</p>
            <p key={
                // @ts-ignore
                event?.id?.toString() +"startDate"
            }>{event?.startDate}</p>
        </EventDiv>
    );

};

export default EventView;