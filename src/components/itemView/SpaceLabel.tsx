import React from "react";
import {ReservableModel, SpaceModel} from "../../dataModels/ReservableModel";
import {StyledDiv} from "./ReservableLabel";

type func = (reservableId: string)=>void;

const SpaceLabel = ({reservableModel, onClick}: {reservableModel: ReservableModel, onClick: func | undefined})=>{
    return(
        <StyledDiv onClick={()=>onClick?.(reservableModel.id as string)}>
            {reservableModel.type} | {reservableModel.name} | {(reservableModel as SpaceModel).reservables?.length} reservables
        </StyledDiv>
    );
};

export default SpaceLabel