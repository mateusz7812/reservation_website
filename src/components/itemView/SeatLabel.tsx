import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";

type func = (reservableId: string)=>void;

const SeatLabel = ({reservableModel, onClick }: {reservableModel: ReservableModel, onClick: func | undefined})=>{
    return(
        <div className="seatLabel" onClick={()=>onClick?.(reservableModel.id as string)}>
            {reservableModel.name}
        </div>
    );
};

export default SeatLabel