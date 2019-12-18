import {ReservableModel, SeatModel} from "../dataModels/ReservableModel";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";
import ReservationModel from "../dataModels/ReservationModel";
import ReservationService from "../services/ReservationService";
import ReservableService from "../services/ReservableService";

describe('add one', ()=> {
    it('correct', async () => {
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new SeatModel({"id": "reservablePromise id"});
        let eventToAdd = new EventModel({"reservable": seat, "reservations":[]});
        let addedEvent = new EventModel({"id": "event id","reservable": seat, "reservations":[]});
        apiService.addEvent = jest.fn((event: EventModel, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: addedEvent
            })
        });
        // @ts-ignore
        await EventService.addOne(eventToAdd).then((result: EventModel|undefined)=>{
            expect(result).toMatchObject(addedEvent);
        })

    });
});

describe('get by id', ()=> {
    it('correct', async () => {
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new SeatModel({"id": " reservablePromise id"});
        let gottenEvent = new EventModel({"id": "event id", "name": "event1", "reservable": seat});

        apiService.getEventById = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenEvent
            })
        });
        // @ts-ignore
        await EventService.getById("event id").then((result: EventModel|undefined)=>{
            expect(result).toMatchObject(gottenEvent);
        })
    });

    it('not found',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');

        apiService.getEventById = jest.fn((id: string, token: string)=>
        {
            return Promise.reject({response: {status: 404, message: "not found"}});
        });
        // @ts-ignore
        await EventService.getById("event id").then((result: EventModel|undefined)=>{
            expect(result === undefined).toBeTruthy();
        })
    });
});

describe("get all", ()=>{
    it('correct', async () => {
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new SeatModel({"id": " reservablePromise id"});
        let gottenEvents = [new EventModel({"id": "event id", "name": "event1", "reservable": seat})];

        apiService.getAllEvents = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenEvents
            })
        });
        // @ts-ignore
        await EventService.getAll().then((result: EventModel|undefined)=>{
            expect(result).toMatchObject(gottenEvents);
        })
    });
});

describe('update one', ()=>{
    it('correct', async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let id = "event id";
        let reservable = new SeatModel({"id": "reservablePromise id"});
        let updateMap = new EventModel({"id": id, "name": "other event name"});
        let updatedEvent = new EventModel({"id": "event id", "name": "other event name", "reservable": reservable});

        const apiService = require('../domain/ApiRequests');

        apiService.updateEvent = jest.fn(()=>{
            return Promise.resolve({
                status: 200,
                data: updatedEvent
            })
        });

        // @ts-ignore
        await EventService.updateOne(updateMap).then((result: ReservationModel|undefined)=>{
            expect(result).toMatchObject(updatedEvent);
        })
    });

    it('no id', async (done)=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let updateMap = new EventModel({"name": "other event name"});
        const apiService = require('../domain/ApiRequests');

        apiService.updateEvent = jest.fn(()=>{
            done.fail("request made")
        });

        // @ts-ignore
        expect(await EventService.updateOne(updateMap) === undefined).toBeTruthy();
        done();
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