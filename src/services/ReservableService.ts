import {ReservableModel} from "../dataModels/ReservableModel";
import {addReservable, deleteReservableById, getAllReservables, getReservableById} from "../domain/ApiRequests";
import {getToken} from "./CookieService";
import {AxiosError, AxiosResponse} from "axios";

function addOne(reservable: ReservableModel): Promise<ReservableModel | undefined> | undefined {
    let token = getToken();
    if (token === undefined) return undefined;

    return addReservable(reservable, token).then((response: AxiosResponse) => {
        return response.status === 200
            ? ReservableModel.new(response.data)
            : undefined;
    });
}

function getAll(): Promise<ReservableModel[] | undefined> | undefined{
    let token = getToken();
    if (token === undefined) return undefined;

    return getAllReservables(token)
        .then((response: AxiosResponse) => {
            return response.status === 200
                ? response.data.map((reservableDict: {})=> ReservableModel.new(reservableDict))
                : undefined;
        });
}

function getById(id: string): Promise<ReservableModel | undefined> | undefined {
    let token = getToken();
    if (token === undefined) return undefined;

    return getReservableById(id, token)
        .then((response: AxiosResponse) => {
            return response.status === 200
                ? ReservableModel.new(response.data)
                : undefined;
        }).catch((error: AxiosError) => {
           if (error?.response?.status === 404) return undefined;
            throw error
        });
}

function deleteById(id: string): boolean {
    let token = getToken();
    if (token === undefined) return false;

    return deleteReservableById(id, token)
}

const ReservableService = {addOne, getById, getAll, deleteById};

export default ReservableService;