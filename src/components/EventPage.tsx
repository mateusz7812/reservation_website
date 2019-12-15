import React, {Component} from "react";
import EventService from "../services/EventService";
import Event from "../dataModels/Event";
import ReservablesTable from "./ReservablesTable";
import {Reservable} from "../dataModels/Reservable";
import ReservableService from "../services/ReservableService";

class EventPage extends Component{
    state = {event: undefined, selections: [], reservables: []};

    componentDidMount(){
        this.loadEvent();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.event !== this.state.event) {
            this.loadEventReservables();
        }
    }

    loadEvent(){
        EventService.getById(this.props.match.params.id).then((event: Event|undefined) =>{
            this.setState({"event": event});
        })
    }

    loadEventReservables(){
        if(this.state.event !== undefined) {
            this.state.event.reservables.forEach((id: string) => {
                ReservableService.getById(id).then((reservable: Reservable | undefined) => {
                    this.setState({reservables: this.state.reservables.concat([reservable])});
                })
            })
        }
    }

    setSelections(reservables: Reservable[]){
        this.setState({"selections": reservables})
    }

    render(){
        return(
            <div>
                <ReservablesTable reservables={this.state.reservables} selections={this.state.selections} setSelections={this.setSelections}/>
            </div>
        );
    }
}

export default EventPage;