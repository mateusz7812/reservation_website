import React from "react";
import {ReservableModel, SpaceModel} from "../../dataModels/ReservableModel";
import {StyledDiv} from "./ReservableLabel";
import styled from "styled-components";

type func = (reservableId: string)=>void;

const SpaceLabel = ({reserved, selected, reservableModel, onClick}: {reserved?: boolean, selected?: boolean, reservableModel: ReservableModel, onClick: func | undefined})=>{
    if(reserved === undefined) reserved = false;
    if(selected === undefined) selected = false;

    let ExtendedDiv = styled(StyledDiv)`
        background-color: ${reserved ? "green": (selected ? "blue": "white")}
    `;

    return(
        <ExtendedDiv onClick={()=>onClick?.(reservableModel.id as string)}>
            {reservableModel.type} | {reservableModel.name} | {(reservableModel as SpaceModel).reservables?.length} reservables
        </ExtendedDiv>
    );
};

export default SpaceLabel