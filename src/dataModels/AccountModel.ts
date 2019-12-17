import ReservationService from "../services/ReservationService";
import ReservationModel from "./ReservationModel";

class AccountModel{
    id: string|undefined;
    login: string|undefined;
    password: string|undefined;
    reservations: string[]|undefined;
    roles: string[]|undefined;

    getReservations(): (Promise<ReservationModel | undefined> | undefined)[]{
        return this.reservations?.map((id: string)=>ReservationService.getById(id)) ?? [];
    }
    
    constructor(params : {}){
        Object.assign(this, params);
    }
}

export default AccountModel;