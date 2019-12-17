
type reservableTypes = "Space" | "Seat";

const getType = (typeName: reservableTypes)=> {
    let types = {"Space": SpaceModel, "Seat": SeatModel};
    return types[typeName]};

abstract class ReservableModel{
    type!: reservableTypes;
    id: string|undefined;
    name: string|undefined;
    space: string|undefined;
    events: string[]|undefined;
    reservations: string[]|undefined;

    static new(params: {}){
        if("type" in params){
            // @ts-ignore
            let type = getType(params["type"]);
            return new type(params);
        }
        return undefined;
    }

}

class SeatModel extends ReservableModel{
    constructor(params: {}) {
        super();
        Object.assign(this, params, {"type": "Seat"});
    }
}

class SpaceModel extends ReservableModel{
    reservables: undefined|Promise<ReservableModel>[]|string[];

    constructor(params: {}) {
        super();
        Object.assign(this, params, {"type": "Space"});
    }

}


export {SeatModel, ReservableModel, SpaceModel};