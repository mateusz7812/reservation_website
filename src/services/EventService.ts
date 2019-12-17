import EventModel from "../dataModels/EventModel";
import {ReservableModel} from "../dataModels/ReservableModel";
import {getToken} from "./CookieService";
import {
    addEvent,
    deleteEventById, getAllEvents,
    getEventById, updateEvent, updateReservation
} from "../domain/ApiRequests";
import {AxiosError, AxiosResponse} from "axios";

function addOne(event: EventModel): Promise<EventModel|undefined>|undefined {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return addEvent(event, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {

            let eventDict = response.data;
            let reservableDict = eventDict.reservable;
            let reservable = ReservableModel.new(reservableDict);
            delete eventDict.reservable;
            return Object.assign(new EventModel({"reservable": reservable}), eventDict)
        }
        return undefined;
    });
}

function getById(id: string): Promise<EventModel|undefined>|undefined {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getEventById(id, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = response.data;
            let reservableDict = reservationDict.reservable;
            let reservable = ReservableModel.new(reservableDict);
            delete reservationDict.reservable;
            let reservationFromResponse = new EventModel({"reservable": reservable});
            return Object.assign(reservationFromResponse, reservationDict);
        }
        return undefined;
    }).catch((error: AxiosError)=>{
        // @ts-ignore
        if (error.response.status === 404){return undefined}
        else{throw error}
    });
}

function getAll(): Promise<EventModel[]|undefined>|undefined {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getAllEvents(token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationList: [] = response.data;
            return reservationList.map((reservationDict: any)=>{
                let reservableDict = reservationDict.reservable;
                let reservable = ReservableModel.new(reservableDict);
                delete reservationDict.reservable;
                let reservationFromResponse = new EventModel({"reservable": reservable});
                return Object.assign(reservationFromResponse, reservationDict);
            });
        }
        return undefined;
    });
}

function updateOne(eventMap: EventModel): Promise<EventModel|undefined>|undefined {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }

    if(eventMap.id === undefined){
        return undefined;
    }

    return updateEvent(eventMap, token).then((response: AxiosResponse)=>{
        if (response.status === 200) {
            let reservationDict = response.data;
            let reservableDict = reservationDict.reservable;
            let reservable = ReservableModel.new(reservableDict);
            delete reservationDict.reservable;
            let reservationFromResponse = new EventModel({"reservable": reservable});
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

const EventService = {addOne, getById, getAll, deleteById, updateOne};

export default EventService;