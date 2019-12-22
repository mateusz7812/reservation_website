import React from "react";
import {ReservableModel} from "../dataModels/ReservableModel";
import ReservableView from "./ReservableView";

const SelectedReservablesList = ({selectedReservablesIds, allReservables, selectionChanger}:
                                     {selectedReservablesIds: string[], allReservables: {[id: string]:ReservableModel}, selectionChanger: (reservableId: string)=>void})=>{
    return(<div id="selectedReservablesList">
        {selectedReservablesIds.map((reservableId)=> <ReservableView key={reservableId+"selection"} selectionChanger={selectionChanger} reservableId={reservableId} allReservables={allReservables}/>)}
    </div>)
};

// @ts-ignore
export default SelectedReservablesList