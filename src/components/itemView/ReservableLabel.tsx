import {ReservableModel} from "../../dataModels/ReservableModel";
import React, {FunctionComponent} from "react";
import SeatLabel from "./SeatLabel";
import SpaceLabel from "./SpaceLabel";
import styled from "styled-components";

type func = (reservableId: string)=>void;

type propsTypes = {
    reservableModel: ReservableModel,
    onClick?: func | undefined
};

let StyledDiv = styled.div`
        margin: 5px 5px;
        box-sizing: border-box;
        border: 1px solid black;
        padding: 2px 4px;
    `;

const ReservableLabel: FunctionComponent<propsTypes> =
    ({reservableModel, onClick})=>{
    return reservableModel?.type === "Seat"
        ? <SeatLabel reservableModel={reservableModel} onClick={onClick}/>
        : reservableModel?.type === "Space"
            ? <SpaceLabel reservableModel={reservableModel} onClick={onClick}/>
            : <div>unknown type</div>;
};

export {StyledDiv};
export default ReservableLabel;