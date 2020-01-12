import EventModel from "../dataModels/EventModel";
import {ReservableModel} from "../dataModels/ReservableModel";
import ReservationModel from "../dataModels/ReservationModel";
import AccountModel from "../dataModels/AccountModel";
const axios = require('axios').default;

const api_url = "http://localhost:8080";
const tokenHeadersConfig = (token:string ) => {return {headers: {'Authorization': "Bearer " + token}}};

function addAccount(account: AccountModel) {
    return axios.post(api_url+"/api/account", account);
}

function getTokenFromApi(account: AccountModel){
    return axios.get(api_url+"/authenticate", {
        auth:
            {
                username: account.login,
                password: account.password
            }
    }
    );
}

function updateAccount(accountMap: AccountModel, token: string){
    return axios.put(api_url+"/api/account/"+accountMap.id, accountMap, tokenHeadersConfig(token));
}

function getAccountById(id:string, token:string){
    return axios.get(api_url+"/api/account/"+id, tokenHeadersConfig(token));
}

function getAllAccounts(token: string){
    return axios.get(api_url+"/api/account", tokenHeadersConfig(token));
}

function getAccountFiltered(account: AccountModel, token:string){
    let values = Object.assign({}, account);

    if(Object.values(values).filter(data => data!== undefined).length === 1 || values["login"] !== undefined ){
        return axios.get(api_url+"/api/account?login=" + values["login"], tokenHeadersConfig(token));
    }
    throw new Error("not implemented");
}

function deleteAccountById(id: string, token: string) {
    return axios.delete(api_url+"/api/account/"+id, tokenHeadersConfig(token));
}

function addEvent(event: EventModel, token: string) {
    return axios.post(api_url+"/api/event", event, tokenHeadersConfig(token));
}

function getEventById(id:string, token:string){
    return axios.get(api_url+"/api/event/"+id, tokenHeadersConfig(token));
}

function getAllEvents(token:string){
    return axios.get(api_url+"/api/event", tokenHeadersConfig(token));
}

function updateEvent(eventMap: EventModel, token: string){
    return axios.put(api_url+"/api/event/"+eventMap.id, eventMap, tokenHeadersConfig(token));
}

function deleteEventById(id: string, token: string){
    return axios.delete(api_url+"/api/event/"+id, tokenHeadersConfig(token));
}

function addReservable(reservable: ReservableModel, token: string){
    return axios.post(api_url+"/api/reservable", reservable, tokenHeadersConfig(token));
}

function getReservableById(id: string, token: string){
    return axios.get(api_url+"/api/reservable/"+id, tokenHeadersConfig(token));
}

function getAllReservables(token: string){
    return axios.get(api_url+"/api/reservable", tokenHeadersConfig(token));
}

function deleteReservableById(id: string, token: string){
    return axios.delete(api_url+"/api/reservable/"+id, tokenHeadersConfig(token));
}

function addReservation(reservation: ReservationModel, token: string){
    return axios.post(api_url+"/api/reservation/", reservation, tokenHeadersConfig(token));
}

function getReservationById(id:string, token:string){
    return axios.get(api_url+"/api/reservation/"+id, tokenHeadersConfig(token));
}

function getAllReservations(token: string){
    return axios.get(api_url+"/api/reservation/", tokenHeadersConfig(token));
}

function updateReservation(reservation: ReservationModel, token: string) {
    return axios.put(api_url+"/api/reservation/"+reservation.id, reservation, tokenHeadersConfig(token));
}

function deleteReservationById(id: string, token: string){
    return axios.delete(api_url+"/api/reservation/"+id, tokenHeadersConfig(token));
}

export {
    addAccount, getTokenFromApi, getAccountById, getAllAccounts, updateAccount, getAccountFiltered, deleteAccountById,
    addEvent, getEventById, getAllEvents, updateEvent, deleteEventById,
    addReservable, getReservableById, getAllReservables, deleteReservableById,
    addReservation, getReservationById, getAllReservations, updateReservation, deleteReservationById
}