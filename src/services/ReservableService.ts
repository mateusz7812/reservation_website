import {Reservable} from "../dataModels/Reservable";
import {addReservable, deleteReservableById, getReservableById} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosResponse} from "axios";

function addOne(reservable: Reservable): Promise<Reservable|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return addReservable(reservable, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservableDict = JSON.parse((response as any).response);
            return Reservable.new(reservableDict);
        }
        return undefined;
    });
}

function getById(id: string): Promise<Reservable|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getReservableById(id, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservableDict = JSON.parse((response as any).response);
            return Reservable.new(reservableDict);
        }
        return undefined;
    });
}

function deleteById(id: string): boolean{
    let token = getToken();
    if( token === undefined){
        return false;
    }
    return deleteReservableById(id, token);
}

const ReservableService = {addOne, getById, deleteById};

export default ReservableService;