import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";

const SpaceLabel = ({reservableModel, selectionChanger}: {reservableModel: ReservableModel, selectionChanger: (reservableId: string)=>void})=>{
    return(
        <div onClick={()=>selectionChanger(reservableModel.id as string)}>
            {reservableModel.name}
        </div>
    );
};

export default SpaceLabel