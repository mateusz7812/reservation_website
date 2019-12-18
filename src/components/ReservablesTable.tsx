import React, {Component, useState} from "react";
import {ReservableModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservableView from "./ReservableView";
class ReservablesTable extends Component{
    state={loadedReservables:{}, reservableId: ""};
    constructor(props: any) {
        super(props);
        // eslint-disable-next-line no-unused-expressions
        props.reservablePromise?.then((r: ReservableModel|undefined)=>{
            if(r!== undefined){
                this.setState({reservableId: (r.id as string)});
                // @ts-ignore
                this.state.loadedReservables[r.id] = r;
                this.setState({loadedReservables: this.state.loadedReservables});
                if(r.type === "Space"){
                    (r as SpaceModel).getReservables().forEach(this.loadReservables);
                }
            }
        })
    }

    loadReservables = (promise: Promise<ReservableModel|undefined>|undefined) => {
        // eslint-disable-next-line no-unused-expressions
        promise?.then((r: ReservableModel|undefined)=>{
            if(r!== undefined){
                // @ts-ignore
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.loadedReservables[r.id] = r;
                this.setState(this.state.loadedReservables);
                if(r.type === "Space"){
                    (r as SpaceModel).getReservables().forEach(this.loadReservables);
                }
            }
        });
    };

    render(){
        return(
            <div>
                {
                    this.state.reservableId === "" ? null : <ReservableView reservableId={this.state.reservableId} allReservables={this.state.loadedReservables}/>
                }
            </div>
        )
    }
}

export default ReservablesTable;