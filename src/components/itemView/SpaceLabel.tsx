import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";

type func = (reservableId: string)=>void;

const SpaceLabel = ({reservableModel, onClick}: {reservableModel: ReservableModel, onClick: func | undefined})=>{
    return(
        <div onClick={()=>onClick?.(reservableModel.id as string)}>
            {reservableModel.name}
        </div>
    );
};

export default SpaceLabel