import {Reservable} from "../dataModels/Reservable";
import {addReservable, deleteReservableById, getReservableById} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosError, AxiosResponse} from "axios";

function addOne(reservable: Reservable): Promise<Reservable|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return addReservable(reservable, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservableDict = response.data;
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
    return getReservableById(id, token)
        .then((response: AxiosResponse)=>{
            if (response.status === 200) {
                let reservableDict = response.data;
                return Reservable.new(reservableDict);
            }
        }).catch((error: AxiosError)=>{
                // @ts-ignore
            if (error.response.status === 404){return undefined}
                else{throw error}
        });
}

function deleteById(id: string): boolean{
    let token = getToken();
    if( token === undefined){
        return false;
    }
    return deleteReservableById(id, token)
}

const ReservableService = {addOne, getById, deleteById};

export default ReservableService;