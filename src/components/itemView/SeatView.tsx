import React from "react";
import styled from "styled-components";

type func = (reservableId: string)=>void;

const SeatView = ({selected, reserved, seatId, onClick}:
                      {selected?: boolean, reserved?: boolean, seatId: string, onClick:func | undefined})=>{

    const StyledDiv = styled.div`
        clear: both;
        height: 20px;
        width: 20px;
        border: 1px solid black;
        border-radius: 2px;
        padding: 3px;
    `;

    let ExtendedDiv = styled(StyledDiv)`
        background-color: ${reserved ? "green": (selected ? "blue": "white")}
    `;

    return(<ExtendedDiv className="seatView" onClick={()=>onClick?.(seatId)}>
        Seat
    </ExtendedDiv>);
};

export default SeatView;