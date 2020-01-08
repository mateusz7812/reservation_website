import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableLabel from "../itemView/ReservableLabel";

const SelectedReservablesList = ({selectedReservablesIds, allReservables, selectionChanger}:
                                     {selectedReservablesIds: string[], allReservables: {[id: string]:ReservableModel}, selectionChanger: (reservableId: string)=>void})=>{
    return(<div id="selectedReservablesList">
        {selectedReservablesIds.map((reservableId)=> <ReservableLabel key={reservableId+"selection"} selectionChanger={selectionChanger} reservableModel={allReservables[reservableId]}/>)}
    </div>)
};

// @ts-ignore
export default SelectedReservablesList