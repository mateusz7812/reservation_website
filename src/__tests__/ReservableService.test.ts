import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservableService from "../services/ReservableService";

const axios = require('axios').default;

it('type test', ()=>{
    let space = new SpaceModel({"reservables": ["id nr 1"]});
    expect(space.reservables).toMatchObject(["id nr 1"]);
});

describe('add one', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seatToAdd: ReservableModel = new SeatModel({});
        let addedSeat = new SeatModel({"id": "reservablePromise id"});
        apiService.addReservable = jest.fn((reservable: ReservableModel, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: addedSeat
            })
        });
        // @ts-ignore
        await ReservableService.addOne(seatToAdd).then((result: ReservableModel|undefined)=>{
            expect(result).toMatchObject(addedSeat);
        })

    });

});

describe('get by id', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let gottenSeat = new SeatModel("reservablePromise id");
        apiService.getReservableById = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenSeat
            })
        });
        // @ts-ignore
        await ReservableService.getById("reservablePromise id").then((result: ReservableModel|undefined)=>{
            expect(result).toMatchObject(gottenSeat);
        })
    });

    it('not found',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        apiService.getReservableById = jest.fn((id: string, token: string)=>
        {
            return Promise.reject({response: {status: 404, message: "not found"}});
        });
        // @ts-ignore
        await ReservableService.getById("reservablePromise id").then((result: ReservableModel|undefined)=>{
            expect(result === undefined).toBeTruthy();
        })
    });
});

describe('delete by id', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");

        const apiService = require('../domain/ApiRequests');

        apiService.deleteReservableById=jest.fn((id: string, token)=>
        {
            return Promise.resolve({
                status: 200
            })
        });

        // @ts-ignore
        await ReservableService.deleteById("id").then((result: boolean)=>expect(result).toBeTruthy());
    });

});