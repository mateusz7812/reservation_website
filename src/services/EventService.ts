import Event from "../dataModels/Event";
import {Reservable} from "../dataModels/Reservable";
import {getToken} from "./CookieService";
import {
    addEvent,
    deleteEventById,
    getEventById
} from "../domain/ApiRequests";
import {AxiosResponse} from "axios";

function addOne(event: Event): Promise<Event|undefined>|undefined {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return addEvent(event, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {

            let eventDict = JSON.parse(response.response);
            let reservableDict = eventDict.reservable;
            let reservable = Reservable.new(reservableDict);
            delete eventDict.reservable;
            return Object.assign(new Event({"reservable": reservable}), eventDict)
        }
        return undefined;
    });
}

function getById(id: string): Promise<Event|undefined>|undefined {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getEventById(id, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = JSON.parse((response as any).response);
            let reservableDict = reservationDict.reservable;
            let reservable = Reservable.new(reservableDict);
            delete reservationDict.reservable;
            let reservationFromResponse = new Event({"reservable": reservable});
            return Object.assign(reservationFromResponse, reservationDict);
        }
        return undefined;
    });
}

function deleteById(id: string): boolean {
    let token = getToken();
    if( token === undefined){
        return false;
    }
    return deleteEventById(id, token);
}

const EventService = {addOne, getById, deleteById};

export default EventService;