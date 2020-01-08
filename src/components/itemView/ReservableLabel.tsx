import {ReservableModel} from "../../dataModels/ReservableModel";
import React from "react";
import SeatLabel from "./SeatLabel";
import SpaceLabel from "./SpaceLabel";

const ReservableLabel = ({reservableModel, selectionChanger}: {reservableModel: ReservableModel, selectionChanger: (reservableId: string)=>void})=>{
    if(reservableModel?.type==="Seat"){
        return <SeatLabel reservableModel={reservableModel} selectionChanger={selectionChanger}/>
    }

    else if(reservableModel?.type === "Space"){
        return <SpaceLabel reservableModel={reservableModel} selectionChanger={selectionChanger}/>
    }

    else {
        return (<div>
            unknown type
        </div>);
    }
};

export default ReservableLabel;