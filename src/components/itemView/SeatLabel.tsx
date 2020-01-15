import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";
import {StyledDiv} from "./ReservableLabel";

type func = (reservableId: string)=>void;

const SeatLabel = ({reservableModel, onClick }: {reservableModel: ReservableModel, onClick: func | undefined})=>{
    return(
        <StyledDiv className="seatLabel" onClick={()=>onClick?.(reservableModel.id as string)}>
            {reservableModel.type} | {reservableModel.name}
        </StyledDiv>
    );
};

export default SeatLabel