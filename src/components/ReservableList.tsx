import React from "react";
import {ReservableModel} from "../dataModels/ReservableModel";
import ReservableLabel from "./itemView/ReservableLabel";

const ReservableList = ({reservables, callWithId}:{reservables: {[key: string]:ReservableModel}, callWithId:(_:string)=>void})=>{
    return(
        <div>
            {
                Object.keys(reservables).map((reservableId: string)=><ReservableLabel key={"reservable_"+reservableId+"_Label"} reservableModel={reservables[reservableId]}  onClick={()=>callWithId(reservableId)}/>)
            }
        </div>
    )
};

export default ReservableList;