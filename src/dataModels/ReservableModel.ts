import ReservationModel from "./ReservationModel";
import ReservationService from "../services/ReservationService";
import ReservableService from "../services/ReservableService";
import EventService from "../services/EventService";

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
            let type = getType(params["type"]);
            return new type(params);
        }
        return undefined;
    }

    getSpace(){
        if(this.space)
            return ReservableService.getById(this.space);
        return undefined;
    }

    getEvents(){
        return this.events?.map((id: string)=>EventService.getById(id)) ?? [];
    }

    getReservations(): (Promise<ReservationModel | undefined> | undefined)[]{
        return this.reservations?.map((id: string)=>ReservationService.getById(id)) ?? [];
    }

}

class SeatModel extends ReservableModel{
    constructor(params: {}) {
        super();
        Object.assign(this, params, {"type": "Seat"});
    }
}

class SpaceModel extends ReservableModel{
    reservables: undefined|string[];

    constructor(params: {}) {
        super();
        Object.assign(this, params, {"type": "Space"});
    }

    getReservables(){
        return this.reservables?.map((id: string)=>ReservableService.getById(id)) ?? [];
    }

}


export {SeatModel, ReservableModel, SpaceModel};