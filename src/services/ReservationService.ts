import Reservation from "../dataModels/Reservation";
import {
    addReservation,
    deleteReservationById,
    getReservationById
} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosResponse} from "axios";
import {Reservable} from "../dataModels/Reservable";

function addOne(reservation: Reservation): Promise<Reservation|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    if("reservable" in reservation){
        // @ts-ignore
        if("id" in reservation.reservable && "type" in reservation.reservable){
            reservation.reservable = Reservable.new({"type": reservation.reservable.type, "id": reservation.reservable.id});
        }
    }
    return addReservation(reservation, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = JSON.parse((response as any).response);
            let reservableDict = reservationDict.reservable;
            let reservable = Reservable.new({"type": reservableDict.type, "id": reservableDict.id});
            delete reservationDict.reservable;
            let reservationFromResponse = new Reservation({"reservable": reservable});
            return Object.assign(reservationFromResponse, reservationDict);
        }
        return undefined;
    });
}

function getById(id: string): Promise<Reservation|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getReservationById(id, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = JSON.parse((response as any).response);
            let reservableDict = reservationDict.reservable;
            let reservable = Reservable.new(reservableDict);
            delete reservationDict.reservable;
            let reservationFromResponse = new Reservation({"reservable": reservable});
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

const ReservationService = {addOne, getById, deleteById};
export default ReservationService;