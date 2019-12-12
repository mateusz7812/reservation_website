import {Reservable} from "./Reservable";

class Event{
    private id: string|undefined;
    name: string|undefined;
    reservable: Reservable|undefined;
    reservations: string[]|undefined;
    startDate: number|undefined;
    endDate: number|undefined;

    constructor(params: {}) {
        if("reservable" in Object.keys(params)){
            this.reservable = Reservable.new((params as any)["reservable"]);
            delete (params as any)["reservable"];
        }
        Object.assign(this, params);
    }
}

export default Event;