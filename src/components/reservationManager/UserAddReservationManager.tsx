import React from "react";
import CookieService from "../../services/CookieService";
import AddReservationManager from "./AddReservationManager";
import AccountModel from "../../dataModels/AccountModel";

const UserAddReservationManager =({eventId}: {eventId: string})=>{
    const account = CookieService.getAccount() as AccountModel;
    let accountId = (account)["id"];

    return(
        <AddReservationManager
        accountId = {accountId}
        eventId={eventId}
        />
    );
};

export default UserAddReservationManager;