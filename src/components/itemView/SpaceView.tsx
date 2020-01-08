import React from "react";
import ReservableView from "./ReservableView";
import {ReservableModel, SpaceModel} from "../../dataModels/ReservableModel";
import SpaceLabel from "./SpaceLabel";
import styled from "styled-components";

const SpaceView =({spaceId, allReservables, selectionChanger}:
                      {spaceId: string, allReservables: {[id: string]: ReservableModel}, selectionChanger:(reservableId: string)=>void})=>{
    let space = allReservables[spaceId];

    let reservablesViews:any=[];
    // eslint-disable-next-line no-unused-expressions
    (space as SpaceModel).reservables?.forEach((id: string)=>
        reservablesViews.push(<ReservableView key={id} reservableId={id} allReservables={allReservables} callWithId={selectionChanger}/>));

    const StyledDiv = styled.div`
        clear: both;
        border: 1px solid black;
        border-radius: 5px;
        padding: 10px;
    `;

    return(
        <StyledDiv>
            <SpaceLabel reservableModel={space} selectionChanger={selectionChanger}/>
            <div>
                {
                    reservablesViews
                }
            </div>
        </StyledDiv>
        )
};

// @ts-ignore
export default SpaceView;