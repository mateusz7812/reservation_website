import DataModel from "./DataModel";

type reservableTypes = "Space" | "Seat";

const getType = (typeName: reservableTypes)=> {
    let types = {"Space": SpaceModel, "Seat": SeatModel};
    return types[typeName]};

abstract class ReservableModel extends DataModel{
    type!: reservableTypes;
    name: string|undefined;
    space: string|undefined;
    events: string[]|undefined;
    reservations: string[]|undefined;

    assign(params: {}) {
        super.assign(params);
    }

    static new(params: {}){
        if("type" in params){
            let type = getType(params["type"]);
            return new type(params);
        }
        return undefined;
    }
}

class SeatModel extends ReservableModel{
    constructor(params: {[key: string]: any}) {
        super();
        params["type"] = "Seat";
        super.assign(params);
    }
}

class SpaceModel extends ReservableModel{
    reservables: undefined|string[];

    constructor(params: {[key: string]: any}) {
        super();
        params["type"] = "Space";
        super.assign(params);
    }
}


export {SeatModel, ReservableModel, SpaceModel};