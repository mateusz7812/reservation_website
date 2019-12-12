import {Reservable} from "./Reservable";

class Reservation{
    id: string|undefined;
    account: string|undefined;
    event: string|undefined;
    reservable: Reservable|undefined;

    constructor(params: {}) {
        if("reservable" in Object.keys(params)){
            this.reservable = Reservable.new((params as any)["reservable"]);
            delete (params as any)["reservable"];
        }
        Object.assign(this, params);
    }

}

export default Reservation;