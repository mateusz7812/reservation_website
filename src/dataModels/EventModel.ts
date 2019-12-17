import {ReservableModel} from "./ReservableModel";

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
}

export default EventModel;