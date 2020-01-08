 import React from "react";
 import {ReservableModel} from "../../dataModels/ReservableModel";
 import SeatView from "./SeatView";
 import SpaceView from "./SpaceView";
 
const ReservableView = ({reservableId, allReservables, callWithId}:
                            {reservableId: string, allReservables: {[id: string]:ReservableModel}, callWithId: (reservableId: string)=>void})=>{
    let reservable: ReservableModel = allReservables[reservableId];

    if(reservable?.type==="Seat"){
       return <SeatView seatId={reservableId} allReservables={allReservables} selectionChanger={callWithId}/>
   }

    else if(reservable?.type === "Space"){
        return <SpaceView spaceId={reservable.id as string} allReservables={allReservables} selectionChanger={callWithId}/>
    }
    else {
        return (<div>
            unknown type
        </div>);
    }
};

export default ReservableView;