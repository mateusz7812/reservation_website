 import React from "react";
 import {ReservableModel} from "../../dataModels/ReservableModel";
 import SeatView from "./SeatView";
 import SpaceView from "./SpaceView";

 type func = (reservableId: string)=>void;

 const ReservableView = ({reservableId, allReservables, onClick}:
                            {reservableId: string, allReservables: {[id: string]:ReservableModel}, onClick: func | undefined})=>{
    let reservable: ReservableModel = allReservables[reservableId];

     return reservable?.type === "Seat"
         ? <SeatView seatId={reservableId} allReservables={allReservables} onClick={onClick}/>
         : reservable?.type === "Space"
            ? <SpaceView spaceId={reservableId} allReservables={allReservables} onClick={onClick}/>
            : <div>loading</div>;
 };

export default ReservableView;