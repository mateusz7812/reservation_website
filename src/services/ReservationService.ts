import ReservationModel from "../dataModels/ReservationModel";
import {
    addReservation,
    deleteReservationById,
    getReservationById, updateReservation
} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosResponse} from "axios";
import {ReservableModel} from "../dataModels/ReservableModel";

function addOne(reservation: ReservationModel): Promise<ReservationModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    if("reservable" in reservation){
        // @ts-ignore
        if("id" in reservation.reservable && "type" in reservation.reservable){
            reservation.reservable = ReservableModel.new({"type": reservation.reservable.type, "id": reservation.reservable.id});
        }
    }
    return addReservation(reservation, token)
        .then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = response.data;
            let reservableDict = reservationDict.reservable;
            let reservable = ReservableModel.new({"type": reservableDict.type, "id": reservableDict.id});
            delete reservationDict.reservable;
            let reservationFromResponse = new ReservationModel({"reservable": reservable});
            return Object.assign(reservationFromResponse, reservationDict);
        }
        return undefined;
    });
}

function getById(id: string): Promise<ReservationModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getReservationById(id, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = response.data;
            let reservableDict = reservationDict.reservable;
            let reservable = ReservableModel.new(reservableDict);
            delete reservationDict.reservable;
            let reservationFromResponse = new ReservationModel({"reservable": reservable});
            return Object.assign(reservationFromResponse, reservationDict);
        }
        return undefined;
    });

}

function updateOne(reservation: ReservationModel): Promise<ReservationModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }

    if(reservation.id === undefined){
        return undefined;
    }

    // @ts-ignore
    return updateReservation(reservation, token).catch(error =>{
        throw error;
    }).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = response.data;
            let reservableDict = reservationDict.reservable;
            let reservable = ReservableModel.new(reservableDict);
            delete reservationDict.reservable;
            let reservationFromResponse = new ReservationModel({"reservable": reservable});
            return Object.assign(reservationFromResponse, reservationDict);
        }
        return undefined;
    });
}

function deleteById(id: string): boolean{
    let token = getToken();
    if( token === undefined){
        return false;
    }
    return deleteReservationById(id, token);
}

const ReservationService = {addOne, getById, updateOne, deleteById};
export default ReservationService;