import {ReservableModel} from "./ReservableModel";

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

}

export default ReservationModel;