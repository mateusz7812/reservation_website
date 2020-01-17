import React from "react";
import {ReservableModel} from "../../dataModels/ReservableModel";
import AccountModel from "../../dataModels/AccountModel";
import EventModel from "../../dataModels/EventModel";

export const DataContext= React.createContext(
        {
            allReservables: new Map<string, ReservableModel>(),
            selectedReservablesIds: new Array<string>(),
            reservedReservablesIds: new Array<string>(),
            loadedAccounts: new Map<string, AccountModel>(),
            loadedEvents: new Map<string, EventModel>()
        }
    );