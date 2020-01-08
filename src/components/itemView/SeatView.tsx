import React from "react";
import styled from "styled-components";
const SeatView = ({seatId, allReservables, selectionChanger}:
                      {seatId: string, allReservables: {}, selectionChanger:(reservableId: string)=>void})=>{

    const StyledDiv = styled.div`
        clear: both;
        height: 20px;
        width: 20px;
        border: 1px solid black;
        border-radius: 2px;
        padding: 3px;
    `;

    return(<StyledDiv className="seatView" onClick={()=>selectionChanger(seatId)}>
        Seat
    </StyledDiv>);
};

export default SeatView;