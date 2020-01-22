import React, {Component} from "react";
import AccountModel from "../../dataModels/AccountModel";
import ReservationModel from "../../dataModels/ReservationModel";
import AccountService from "../../services/AccountService";
import ReservationService from "../../services/ReservationService";
import ReservationLabel from "../itemView/ReservationLabel";
import EventModel from "../../dataModels/EventModel";
import {ReservableModel} from "../../dataModels/ReservableModel";
import EventService from "../../services/EventService";
import ReservableService from "../../services/ReservableService";

class AdminReservationIdView extends Component<{reservation?: ReservationModel}, {
    account: AccountModel|undefined, reservation: ReservationModel|undefined, event: EventModel|undefined, reservable: ReservableModel|undefined
}> {
    state={account: undefined, reservation: this.props.reservation, event: undefined, reservable: undefined};
    reservation_id: string|undefined = undefined;

    constructor(props: any) {
        super(props);
        this.reservation_id = props.match.params.id;
    }

    componentDidMount() {
        if(this.state.reservation === undefined) {
            this.loadReservationAndDetails();
        }else{
            this.loadDetails();
        }
    }

    loadAccount = () => {
        if (this.state.reservation !== undefined) {
            // @ts-ignore
            // eslint-disable-next-line no-unused-expressions
            AccountService.getById(this.state.reservation.account)?.then((account: AccountModel) => this.setState({account: account}))
        }
    };

    loadEvent = () => {
        if (this.state.reservation !== undefined) {
            // @ts-ignore
            // eslint-disable-next-line no-unused-expressions
            EventService.getById(this.state.reservation.event)?.then((event: EventModel) => this.setState({event: event}))
        }
    };

    loadReservable = () => {
        if (this.state.reservation !== undefined) {
            // @ts-ignore
            // eslint-disable-next-line no-unused-expressions
            ReservableService.getById(this.state.reservation.reservable)?.then((reservable: ReservableModel) => this.setState({reservable: reservable}))
        }
    };

    loadReservationAndDetails = () => {
        if (this.reservation_id != null) {
            // eslint-disable-next-line no-unused-expressions
            ReservationService.getById(this.reservation_id)?.then((reservation: ReservationModel | undefined) => {
                if (reservation !== undefined) {
                    this.setState({reservation: reservation},()=>{
                        this.loadDetails();
                    });
                }
            })
        }
    };

    private loadDetails() {
        this.loadReservable();
        this.loadAccount();
        this.loadEvent();
    }

    render() {
        return (
            <div>
                {
                    this.state.reservation === undefined
                        ? null
                        :
                            <ReservationLabel
                                // @ts-ignore
                                reservation={this.state.reservation} account={this.state.account} event={this.state.event} reservable={this.state.reservable}/>

                }
            </div>
        );
    }
}

export default AdminReservationIdView;