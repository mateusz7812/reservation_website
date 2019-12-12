import Event from "../dataModels/Event";
import {Reservable} from "../dataModels/Reservable";
import Reservation from "../dataModels/Reservation";
import Account from "../dataModels/Account";
const axios = require('axios').default;

const api_url = "http://localhost:8080";
const tokenHeadersConfig = (token:string ) => {return {headers: {'Authorization': "Bearer " + token}}};

function addAccount(account: Account) {
    return axios.post(api_url+"/api/account", account);
}

function getTokenForAccount(account: Account){
    return axios.get(api_url+"/authenticate", {
        auth:
            {
                username: account.login,
                password: account.password
            }
    }
    );
}

function getAccountById(id:string, token:string){
    return axios.get(api_url+"/api/account/"+id, tokenHeadersConfig(token));
}

function getAccountFiltered(account: Account, token:string){
    let values = Object.assign({}, account);

    if(Object.values(values).filter(data => data!== undefined).length === 1 || values["login"] !== undefined ){
        return axios.get(api_url+"/api/account?login=" + values["login"], tokenHeadersConfig(token));
    }
    throw new Error("not implemented");
}

function deleteAccountById(id: string, token: string) {
    return axios.delete(api_url+"/api/account/"+id, tokenHeadersConfig(token));
}

function addEvent(event: Event, token: string) {
    return axios.post(api_url+"/api/event", event, tokenHeadersConfig(token));
}

function getEventById(id:string, token:string){
    return axios.get(api_url+"/api/event/"+id, tokenHeadersConfig(token));
}

function deleteEventById(id: string, token: string){
    return axios.delete(api_url+"/api/event/"+id, tokenHeadersConfig(token));
}

function addReservable(reservable: Reservable, token: string){
    return axios.post(api_url+"/api/reservable", reservable, tokenHeadersConfig(token));
}

function getReservableById(id: string, token: string){
    return axios.get(api_url+"/api/reservable/"+id, tokenHeadersConfig(token));
}

function deleteReservableById(id: string, token: string){
    return axios.delete(api_url+"/api/reservable/"+id, tokenHeadersConfig(token));
}

function addReservation(reservation: Reservation, token: string){
    return axios.post(api_url+"/api/reservation", reservation, tokenHeadersConfig(token));
}

function getReservationById(id:string, token:string){
    return axios.get(api_url+"/api/reservation/"+id, tokenHeadersConfig(token));
}

function updateReservation(reservation: Reservation, token: string) {
    return axios.put(api_url+"/api/reservation/"+reservation.id, reservation, tokenHeadersConfig(token));
}

function deleteReservationById(id: string, token: string){
    return axios.delete(api_url+"/api/reservation/"+id, tokenHeadersConfig(token));
}

export {addAccount, getTokenForAccount, getAccountById, getAccountFiltered, deleteAccountById, addEvent, getEventById, deleteEventById, addReservable, getReservableById, deleteReservableById, addReservation, getReservationById, updateReservation, deleteReservationById}