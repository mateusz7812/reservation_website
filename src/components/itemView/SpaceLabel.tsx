import React from "react";
import {ReservableModel, SpaceModel} from "../../dataModels/ReservableModel";
import {StyledDiv} from "./ReservableLabel";
import styled from "styled-components";

type func = (reservableId: string)=>void;

const SpaceLabel = ({reserved, selected, reservableModel, onClick}: {reserved?: boolean, selected?: boolean, reservableModel: ReservableModel, onClick: func | undefined})=>{
    if(reserved === undefined) reserved = false;
    if(selected === undefined) selected = false;

    let ExtendedDiv = styled(StyledDiv)`
        ${reserved
        ? "background-color: lightgrey;"
        : (
            selected
                ? "box-shadow: 0 0 2px 2px black;"
                : undefined
        )}
    `;

    return(
        <ExtendedDiv onClick={()=>onClick?.(reservableModel.id as string)}>
            {reservableModel.type} | {reservableModel.name} | {(reservableModel as SpaceModel).reservables?.length} reservables
        </ExtendedDiv>
    );
};

export default SpaceLabel