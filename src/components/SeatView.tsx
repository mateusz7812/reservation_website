import React from "react";
import {SeatModel} from "../dataModels/ReservableModel";
const SeatView = ({seatId, allReservables, selectionChanger}:
                      {seatId: string, allReservables: {}, selectionChanger:(reservableId: string)=>void})=>{
    return(<div className="seatView" onClick={()=>selectionChanger(seatId)}>
        Seat
    </div>);
};

export default SeatView;