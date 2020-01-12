import {ReservableModel} from "../../dataModels/ReservableModel";
import React, {FunctionComponent} from "react";
import SeatLabel from "./SeatLabel";
import SpaceLabel from "./SpaceLabel";

type func = (reservableId: string)=>void;

type propsTypes = {
    reservableModel: ReservableModel,
    onClick?: func | undefined
};

const ReservableLabel: FunctionComponent<propsTypes> =
    ({reservableModel, onClick})=>{
    return reservableModel?.type === "Seat"
        ? <SeatLabel reservableModel={reservableModel} onClick={onClick}/>
        : reservableModel?.type === "Space"
            ? <SpaceLabel reservableModel={reservableModel} onClick={onClick}/>
            : <div>unknown type</div>;
};


export default ReservableLabel;