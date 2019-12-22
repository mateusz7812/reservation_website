 import React from "react";
 import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
 import SeatView from "./SeatView";
 import SpaceViewExtended from "./SpaceViewExtended";
const ReservableView = ({reservableId, allReservables, selectionChanger}:
                            {reservableId: string, allReservables: {[id: string]:ReservableModel}, selectionChanger: (reservableId: string)=>void})=>{
    let reservable: ReservableModel = allReservables[reservableId];

    if(reservable?.type==="Seat"){
       return <SeatView seatId={reservableId} allReservables={allReservables} selectionChanger={selectionChanger}/>
   }

    else if(reservable?.type === "Space"){
        return <SpaceViewExtended spaceId={reservable.id as string} allReservables={allReservables} selectionChanger={selectionChanger}/>
    }
    else {
        return (<div>
            loading
        </div>);
    }
};

export default ReservableView;