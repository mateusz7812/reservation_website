import React, {Component} from "react";
import AccountModel from "../../dataModels/AccountModel";
import ReservationModel from "../../dataModels/ReservationModel";
import AccountService from "../../services/AccountService";
import ReservationService from "../../services/ReservationService";
import AccountLabel from "../itemView/AccountLabel";
import ReservationLabel from "../itemView/ReservationLabel";
import {AdminSubpageDiv} from "./AdminPage";

class AdminAccountIdPage extends Component<{}, {account: AccountModel|undefined, reservations: ReservationModel[]}> {
    state={account: undefined, reservations: []};
    account_id: string|undefined = undefined;

    constructor(props: any) {
        super(props);
        this.account_id = props.match.params.id;
    }

    componentDidMount() {
        this.loadAccount();
    }

    loadAccount = () => {
        if (this.account_id != null) {
            // eslint-disable-next-line no-unused-expressions
            AccountService.getById(this.account_id)?.then((account: AccountModel) => this.setState({account: account}, this.loadReservations))
        }
    };

    loadReservations = () => {
        if(this.state.account !== undefined){
            // @ts-ignore
            // eslint-disable-next-line no-unused-expressions
            this.state.account.reservations.map((reservationId)=>
                ReservationService.getById(reservationId)?.then((reservation: ReservationModel | undefined)=> {
                    if(reservation !== undefined) {
                        // @ts-ignore
                        this.state.reservations.push(reservation);
                        this.setState({reservations: this.state.reservations});
                    }
                })
            );
        }
    };

    render() {
        return (
            <AdminSubpageDiv>
                {
                    this.state.account === undefined
                        ? null
                        : <>
                            <AccountLabel
                                // @ts-ignore
                                account={this.state.account} />
                            <p>Reservations:</p>
                            <div>
                                {
                                    this.state.reservations.map((reservation: ReservationModel)=>
                                        <ReservationLabel key={reservation.id}
                                              reservation={reservation}
                                              account={this.state.account}
                                              event={undefined}
                                              reservable={undefined}
                                        />)
                                }
                            </div>
                        </>
                }
            </AdminSubpageDiv>
        );
    }
}

export default AdminAccountIdPage;