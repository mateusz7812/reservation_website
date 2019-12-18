 import React from "react";
 import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
 import SeatView from "./SeatView";
 import SpaceView from "./SpaceView";
const ReservableView = ({reservableId, allReservables}: {reservableId: string, allReservables: any})=>{
    let reservable: ReservableModel = allReservables[reservableId];

    if(reservable?.type==="Seat"){
       return <SeatView seatId={reservableId} allReservables={allReservables}/>
   }

    else if(reservable?.type === "Space"){
        return <SpaceView spaceId={reservable.id as string} allReservables={allReservables}/>
    }
    else {
        return (<div>
            loading
        </div>);
    }
};

export default ReservableView;