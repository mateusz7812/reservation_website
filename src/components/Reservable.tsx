import React from "react";
import {Reservable as ReservableModel} from "../dataModels/Reservable";

const Reservable = ({reservable, onClick}:{reservable: ReservableModel, onClick:()=>void})=>{
    return(
        <div onClick={onClick}>
           <p>{reservable.name}</p>
        </div>
    );
};

export default Reservable;