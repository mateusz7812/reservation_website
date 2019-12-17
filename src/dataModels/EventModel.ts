import {ReservableModel} from "./ReservableModel";
import ReservationModel from "./ReservationModel";
import ReservationService from "../services/ReservationService";
import ReservableService from "../services/ReservableService";

class EventModel{
    id: string|undefined;
    name: string|undefined;
    reservable: ReservableModel|undefined;
    reservations: string[]|undefined;
    startDate: number|undefined;
    endDate: number|undefined;

    constructor(params: {}) {
        if("reservable" in Object.keys(params)){
            this.reservable = ReservableModel.new((params as any)["reservable"]);
            delete (params as any)["reservable"];
        }
        Object.assign(this, params);
    }

    getReservations(): (Promise<ReservationModel | undefined> | undefined)[]{
        return this.reservations?.map((id: string)=>ReservationService.getById(id)) ?? [];
    }

    getReservable(){
        return ReservableService.getById(this.reservable?.id as string);
    }
}

export default EventModel;