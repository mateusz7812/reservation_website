import React from "react";
import CookieService from "../../services/CookieService";
import AddReservationManager from "./AddReservationManager";
import AccountModel from "../../dataModels/AccountModel";

const UserAddReservationManager =({eventId}: {eventId: string})=>{
    let accountId = (CookieService.getAccount() as AccountModel)["id"];

    return(
        <AddReservationManager
        accountId = {accountId}
        eventId={eventId}
        />
    );
};

export default UserAddReservationManager;