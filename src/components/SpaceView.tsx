import React, {Component} from "react";
import {ReservableModel} from "../dataModels/ReservableModel";
import ReservableService from "../services/ReservableService";
import ReservableView from "./ReservableView";

class SpaceView extends Component{
    render(){
        return(
            <div>
                {
                    //this.props["spaceModel"].reservables.map((reservable: ReservableModel)=> <ReservableView key={reservable.id} reservable={reservable} />)
                }
               </div>
            )
    }
}

export default SpaceView;