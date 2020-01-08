import ReservationModel from "../dataModels/ReservationModel";
import {
    addReservation,
    deleteReservationById, getAllReservations,
    getReservationById, updateReservation
} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosError, AxiosResponse} from "axios";
import {ReservableModel} from "../dataModels/ReservableModel";

function readReservation(reservationDict: any) {
    reservationDict.reservable = ReservableModel.new(reservationDict.reservable);
    return new ReservationModel(reservationDict);
}

function addOne(reservation: ReservationModel): Promise<ReservationModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }

    return addReservation(reservation, token)
        .then((response: AxiosResponse)=>
            response.status === 200
                ? readReservation(response.data)
                : undefined);
}

function getById(id: string): Promise<ReservationModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined) return undefined;

    return getReservationById(id, token)
        .then((response: AxiosResponse)=>
            response.status === 200
                ? readReservation(response.data)
                : undefined
        );
}


function getAll(): Promise<ReservationModel[]|undefined>|undefined{
    let token = getToken();
    if( token === undefined) return undefined;

    return getAllReservations(token)
        .then((response: AxiosResponse)=>
            response.status === 200
                ? response.data.map((reservationDict: any) => readReservation(reservationDict))
                : undefined
        );
}

function updateOne(reservation: ReservationModel): Promise<ReservationModel|undefined>|undefined{
    let token = getToken();
    if( token === undefined) return undefined;

    if(reservation.id === undefined) return undefined;

    return updateReservation(reservation, token)
        .catch((error: AxiosError) => {throw error})
        .then((response: AxiosResponse)=>
            response.status === 200
                ? readReservation(response.data)
                : undefined
        );
}

function deleteById(id: string): boolean{
    let token = getToken();
    if( token === undefined) return false;

    return deleteReservationById(id, token);
}

const ReservationService = {addOne, getById, getAll, updateOne, deleteById};
export default ReservationService;