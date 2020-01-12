import DataModel from "./DataModel";

class ReservationModel extends DataModel{
    account: string|undefined;
    event: string|undefined;
    reservable: string|undefined;

    constructor(params: {}) {
        super();
        super.assign(params);
    }
}

export default ReservationModel;