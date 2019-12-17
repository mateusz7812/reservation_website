 import React from "react";
 import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
 import SeatView from "./SeatView";
 import SpaceView from "./SpaceView";
const ReservableView = ({reservable}: {reservable: ReservableModel})=>{
    if(reservable.type==="Seat"){
       return <SeatView seatModel={reservable as SeatModel}/>
   }
    else if(reservable.type === "Space"){
        return <SpaceView spaceModel={reservable as SpaceModel}/>
    }
};

export default ReservableView;