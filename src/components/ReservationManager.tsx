import React, {Component} from "react";
import {ReservableModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservableView from "./ReservableView";
import SelectedReservablesList from "./SelectedReservablesList";
class ReservationManager extends Component{
    state={loadedReservables:{}, reservableId: "", selectedReservablesIds: Array<string>()};
    constructor(props: any) {
        super(props);
        // eslint-disable-next-line no-unused-expressions
        props.reservablePromise?.then((r: ReservableModel|undefined)=>{
            if(r!== undefined){
                // @ts-ignore
                this.state.loadedReservables[r.id] = r;
                this.setState({loadedReservables: this.state.loadedReservables});
                this.setState({reservableId: r.id});
                if(r.type === "Space"){
                    (r as SpaceModel).getReservables().forEach(this.loadReservables);
                }
            }
        });
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

    changeSelection = (reservableId: string)=> {
        if (this.state.selectedReservablesIds.includes(reservableId)) {
            const indexOf = this.state.selectedReservablesIds.indexOf(reservableId);
            this.state.selectedReservablesIds.splice(indexOf, 1);
        } else {
            this.state.selectedReservablesIds.push(reservableId);
        }
        this.setState({selectedReservablesIds: this.state.selectedReservablesIds});
    };

    render(){
        return(
            <div id="reservationManager">
                <div>
                    {
                        this.state.reservableId === "" ? <p>loading</p> : <ReservableView reservableId={this.state.reservableId} allReservables={this.state.loadedReservables} selectionChanger={this.changeSelection}/>
                    }
                </div>
                <SelectedReservablesList selectedReservablesIds={this.state.selectedReservablesIds} allReservables={this.state.loadedReservables} selectionChanger={this.changeSelection}/>
            </div>
        )
    }
}

// @ts-ignore
export default ReservationManager;