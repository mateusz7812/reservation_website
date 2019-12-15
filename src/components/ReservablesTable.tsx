import React from "react";
import {Reservable} from "../dataModels/Reservable";
import ReservableView from "../components/Reservable";

const ReservablesTable = ({reservables, selections, setSelections}: {reservables:Reservable[], selections:Reservable[], setSelections: ((_:Reservable[]) => void)})=>{
   return(
       <div>
           {
               reservables.map((reservable: Reservable)=><ReservableView key={reservable.id} onClick={()=>setSelections(selections.concat([reservable]))} reservable={reservable}/>)
           }
       </div>
   )
};

export default ReservablesTable;