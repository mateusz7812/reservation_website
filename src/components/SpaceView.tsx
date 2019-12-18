import React, {useState} from "react";
import ReservableView from "./ReservableView";
import {ReservableModel, SpaceModel} from "../dataModels/ReservableModel";

const SpaceView =({spaceId, allReservables}:{spaceId: string, allReservables: {[id: string]: any}})=>{
    let space = allReservables[spaceId];

    let reservablesViews:any=[];
    // eslint-disable-next-line no-unused-expressions
    (space as SpaceModel).reservables?.forEach((id: string)=>reservablesViews.push(<ReservableView key={id} reservableId={id} allReservables={allReservables}/>));

    return(
        <div>
            <div>
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

export default SpaceView;