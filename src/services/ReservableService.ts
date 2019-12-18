import {ReservableModel} from "../dataModels/ReservableModel";
import {addReservable, deleteReservableById, getReservableById} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosError, AxiosResponse} from "axios";

function addOne(reservable: ReservableModel): Promise<ReservableModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return addReservable(reservable, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservableDict = response.data;
            return ReservableModel.new(reservableDict);
        }
        return undefined;
    });
}

function getById(id: string): Promise<ReservableModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getReservableById(id, token)
        .then((response: AxiosResponse)=>{
            if (response.status === 200) {
                let reservableDict = response.data;
                return ReservableModel.new(reservableDict);
            }
        }).catch((error: AxiosError)=>{
                // @ts-ignore
            console.log(error);
            if(error.response !== undefined){
                if("status" in error.response){
                    if (error?.response?.status === 404){return undefined}

                }
            }
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