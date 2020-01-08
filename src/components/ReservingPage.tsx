import React, {Component} from "react";
import ReservationService from "../services/ReservationService";
import ReservationModel from "../dataModels/ReservationModel";
import ReservableLabel from "./itemView/ReservableLabel";
import {ReservableModel} from "../dataModels/ReservableModel";
import {AxiosError} from "axios";

class ReservingPage extends Component{
    state:{reservationsToAdd: ReservationModel[], allReservables:{[key: string]: ReservableModel}, messages: {[key:number]: string}, showExitButton: boolean}=
        // @ts-ignore
        {reservationsToAdd: this.props.location.state?.reservationsToAdd, allReservables: this.props.location.state?.allReservables, messages: {}, showExitButton: false};

    constructor(props: any) {
        super(props);
        // @ts-ignore
        if(props.location.state === undefined || !("reservationsToAdd" in props.location.state) || !("allReservables" in props.location.state)){
            this.redirect();
            return;
        }
    }

    componentDidMount(): void{
        this.loadReservations();
    }

    redirect = () => {
        // @ts-ignore
        let path =  this.props.location.state?.redirectPath;
        if(path === undefined)
            path = "/";
        // @ts-ignore
        this.props.history.replace(path);
    };

    loadReservations = () => {
        for(let index = 0; index < this.state.reservationsToAdd.length; index++){
            let reservationToAdd = this.state.reservationsToAdd[index];
            // eslint-disable-next-line no-unused-expressions
            ReservationService.addOne(reservationToAdd)
                ?.then((reservation: ReservationModel | undefined | void) => this.handleResponse(reservation, index))
                ?.catch((error: AxiosError)=>this.setErrorMessage(index, error));
        }
    };

    handleResponse = (reservation: ReservationModel | undefined | void, index: number) => {
        if (reservation !== undefined) {
            setTimeout(() => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.reservationsToAdd[index] = reservation;
                this.setState({reservationsToAdd: this.state.reservationsToAdd});
                this.ifEndOfAddingHandleIt();
            }, 500);
        }
    };

    setErrorMessage = (reservationIndex: number, error: AxiosError) => {
        setTimeout(()=>{
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.messages[reservationIndex] = error.response?.data?.message;
            this.setState({messages: this.state.messages});
            this.ifEndOfAddingHandleIt();
        }, 500);
    };

    ifEndOfAddingHandleIt = () => {
        const reservationsAdded = this.state.reservationsToAdd.filter((reservation: ReservationModel) => reservation.added?.());
        const reservationsToAddLength = this.state.reservationsToAdd.length;
        const addedReservationsLength = reservationsAdded.length;
        if (addedReservationsLength === reservationsToAddLength) {
            setTimeout(() => {
                this.redirect();
            }, 500);
        }
        else {
            const errorMessagesLength = Object.keys(this.state.messages).length;
            if((addedReservationsLength + errorMessagesLength) === reservationsToAddLength)
            {
                this.setState({showExitButton: true});
            }
        }
    };

    messageOrAdding = (index: number) => {
        return index in Object.keys(this.state.messages)
            ? this.state.messages[index]
            : "adding";
    };

    render(){
        return(
            <div>
                {
                    this.state.reservationsToAdd?.map((reservation)=>
                        <div key={reservation.reservable?.id+"div"}>
                            <ReservableLabel
                            // @ts-ignore
                            reservableModel={this.state.allReservables[reservation.reservable?.id as string]} selectionChanger={()=>{}}/>
                            {
                                reservation.added?.()
                                    ? "added"
                                    : this.messageOrAdding(this.state.reservationsToAdd.indexOf(reservation))
                            }
                        </div>)
                }
                {
                    this.state.showExitButton ? <input id="backButton" type="button" value={"Back"} onClick={this.redirect}/> : null
                }
            </div>
        );
    }
}

export default ReservingPage;