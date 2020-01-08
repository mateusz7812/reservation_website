import {ReservableModel} from "./ReservableModel";
import AccountService from "../services/AccountService";
import EventService from "../services/EventService";
import ReservableService from "../services/ReservableService";

class ReservationModel{
    id: string|undefined;
    account: string|undefined;
    event: string|undefined;
    reservable: ReservableModel|undefined;

    constructor(params: {}) {
        if("reservable" in Object.keys(params)){
            this.reservable = ReservableModel.new((params as any)["reservable"]);
            delete (params as any)["reservable"];
        }
        Object.assign(this, params);
    }

    getAccount(){
        return AccountService.getById(this.account as string);
    }

    getEvent(){
        return EventService.getById(this.event as string);
    }

    getReservable(){
        return ReservableService.getById(this.reservable?.id as string);
    }

    added() {
        return this.id !== undefined;
    }
}

export default ReservationModel;