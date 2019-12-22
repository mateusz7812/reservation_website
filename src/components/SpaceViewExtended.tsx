import React from "react";
import ReservableView from "./ReservableView";
import {ReservableModel, SpaceModel} from "../dataModels/ReservableModel";

const SpaceViewExtended =({spaceId, allReservables, selectionChanger}:
                      {spaceId: string, allReservables: {[id: string]: ReservableModel}, selectionChanger:(reservableId: string)=>void})=>{
    let space = allReservables[spaceId];

    let reservablesViews:any=[];
    // eslint-disable-next-line no-unused-expressions
    (space as SpaceModel).reservables?.forEach((id: string)=>
        reservablesViews.push(<ReservableView key={id} reservableId={id} allReservables={allReservables} selectionChanger={selectionChanger}/>));

    return(
        <div>
            <div onClick={()=>selectionChanger(spaceId)}>
                {space?.name}
            </div>
            <div>
                {
                    reservablesViews
                }
            </div>
        </div>
        )
};

// @ts-ignore
export default SpaceViewExtended;