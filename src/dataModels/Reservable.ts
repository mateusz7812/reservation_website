
type reservableTypes = "Space" | "Seat";

const getType = (typeName: reservableTypes)=> {
    let types = {"Space": Space, "Seat": Seat};
    return types[typeName]};

abstract class Reservable{
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

class Seat extends Reservable{
    constructor(params: {}) {
        super();
        Object.assign(this, params, {"type": "Seat"});
    }
}

class Space extends Reservable{
    reservables: string[]|undefined;

    constructor(params: {}) {
        super();
        Object.assign(this, params, {"type": "Space"});
    }

}


export {Seat, Reservable, Space};