import {Seat} from "../dataModels/Reservable";
import EventService from "../services/EventService";
import Event from "../dataModels/Event";

describe('add one', ()=> {
    it('correct', async () => {
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new Seat({"id": "reservable id"});
        let eventToAdd = new Event({"reservable": seat, "reservations":[]});
        let addedEvent = new Event({"id": "event id","reservable": seat, "reservations":[]});
        apiService.addEvent = jest.fn((event: Event, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(addedEvent)
            })
        });
        // @ts-ignore
        await EventService.addOne(eventToAdd).then((result: Event|undefined)=>{
            expect(result).toMatchObject(addedEvent);
        })

    });
});

describe('get by id', ()=> {
    it('correct', async () => {
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new Seat({"id": " reservable id"});
        let gottenEvent = new Event({"id": "delete id", "name": "event1", "reservable": seat});

        apiService.getEventById = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(gottenEvent)
            })
        });
        // @ts-ignore
        await EventService.getById("event id").then((result: Event|undefined)=>{
            expect(result).toMatchObject(gottenEvent);
        })
    });
});

describe('delete by id', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");

        const apiService = require('../domain/ApiRequests');

        apiService.deleteEventById=jest.fn((id: string, token)=>
        {
            return Promise.resolve({
                status: 200
            })
        });

        // @ts-ignore
        await EventService.deleteById("id").then((result: boolean)=>expect(result).toBeTruthy());

    });
});