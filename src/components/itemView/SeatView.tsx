import React from "react";
import styled from "styled-components";

type func = (reservableId: string)=>void;

const SeatView = ({seatId, allReservables, onClick}:
                      {seatId: string, allReservables: {}, onClick:func | undefined})=>{

    const StyledDiv = styled.div`
        clear: both;
        height: 20px;
        width: 20px;
        border: 1px solid black;
        border-radius: 2px;
        padding: 3px;
    `;

    return(<StyledDiv className="seatView" onClick={()=>onClick?.(seatId)}>
        Seat
    </StyledDiv>);
};

export default SeatView;