import DataModel from "./DataModel";

class EventModel extends DataModel{
    name: string|undefined;
    reservable: string|undefined;
    reservations: string[]|undefined;
    startDate: number|undefined;
    endDate: number|undefined;

    constructor(params: {}) {
        super();
        super.assign(params);
    }
}

export default EventModel;