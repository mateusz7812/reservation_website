import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";

const SeatLabel = ({reservableModel, selectionChanger }: {reservableModel: ReservableModel, selectionChanger: (reservableId: string)=>void})=>{
    return(
        <div className="seatLabel" onClick={()=>selectionChanger(reservableModel.id as string)}>
            {reservableModel.name}
        </div>
    );
};

export default SeatLabel