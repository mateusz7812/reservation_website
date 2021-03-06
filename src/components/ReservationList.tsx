import React, {FunctionComponent} from "react";
import ReservationModel from "../dataModels/ReservationModel";
import ReservationLabel from "./itemView/ReservationLabel";
import {ReservableModel} from "../dataModels/ReservableModel";
import EventModel from "../dataModels/EventModel";
import AccountModel from "../dataModels/AccountModel";

type fun = (_: string)=> void;

const ReservationList: FunctionComponent<{
        reservations: {[key: string]: ReservationModel}, accounts: {[key: string]: AccountModel},
        events: {[key: string]: EventModel}, reservables: {[key: string]: ReservableModel},
        callWithId: fun
    }> = ({reservations, accounts, events, reservables, callWithId}) =>{

    const generateLabelForId = (id: string) => {
        const reservation = reservations[id];
        const reservable = reservables[reservation.reservable as string];
        const event = events[reservation.event as string];
        const account = accounts[reservation.account as string];
        return <ReservationLabel key={"ReservationLabel_"+id} reservation={reservation} account={account} event={event} reservable={reservable} onClick={()=> callWithId(reservation.id as string)}/>
    };

    return(
        <div>
            {
                Object.keys(reservations).map((id)=>generateLabelForId(id))
            }
        </div>
    );
};

export default ReservationList;