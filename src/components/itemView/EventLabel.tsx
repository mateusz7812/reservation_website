import React from "react";
import EventModel from "../../dataModels/EventModel";
import styled from "styled-components";

const EventLabel = ({event, onClick}: { event: EventModel, onClick?: () => void }) => {
    const toDateTime = (secs: number) => {
        let t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    };

    const EventDiv = styled.div`
        padding: 5px 10px;
        border: 1px solid black;
        margin: 4px;
    `;
    const startDate = toDateTime(event?.startDate as number);
    const endDate = toDateTime(event?.endDate as number);
    const getDateString = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return (
        <EventDiv className="eventView" onClick={onClick}>
            {event?.name} | {getDateString(startDate)} - {getDateString(endDate)}
        </EventDiv>
    );

};

export default EventLabel;