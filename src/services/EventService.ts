import EventModel from "../dataModels/EventModel";
import {getToken} from "./CookieService";
import {
    addEvent,
    deleteEventById, getAllEvents,
    getEventById, updateEvent
} from "../domain/ApiRequests";
import {AxiosError, AxiosResponse} from "axios";

function addOne(event: EventModel): Promise<EventModel|undefined>|undefined {
    let token = getToken();
    if( token === undefined) return undefined;

    return addEvent(event, token).then((response: AxiosResponse)=>{
        return response.status === 200
            ? new EventModel(response.data)
            : undefined;
    });
}

function getById(id: string): Promise<EventModel|undefined>|undefined {
    let token = getToken();
    if( token === undefined) return undefined;

    return getEventById(id, token).then((response: AxiosResponse)=>{
        return response.status === 200
            ? new EventModel(response.data)
            : undefined;
    }).catch((error: AxiosError)=>{
        if (error.response?.status === 404) return undefined;
        throw error
    });
}

function getAll(): Promise<EventModel[]|undefined>|undefined {
    let token = getToken();
    if( token === undefined) return undefined;

    return getAllEvents(token).then((response: AxiosResponse)=>{
        return response.status === 200
            ? response.data.map((eventDict: any) => new EventModel(eventDict))
            : undefined;
    });
}

function updateOne(eventMap: EventModel): Promise<EventModel|undefined>|undefined {
    let token = getToken();
    if( token === undefined) return undefined;

    if(eventMap.id === undefined) return undefined;

    return updateEvent(eventMap, token).then((response: AxiosResponse)=>{
        return response.status === 200
            ? new EventModel(response.data)
            : undefined;
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