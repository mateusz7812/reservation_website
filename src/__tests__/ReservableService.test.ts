import {Reservable, Seat, Space} from "../dataModels/Reservable";
import ReservableService from "../services/ReservableService";

it('type test', ()=>{
    let space = new Space({"reservables": ["id nr 1"]});
    expect(space.reservables).toMatchObject(["id nr 1"]);
});

describe('add one', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seatToAdd: Reservable = new Seat({});
        let addedSeat = new Seat({"id": "reservable id"});
        apiService.addReservable = jest.fn((reservable: Reservable, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(addedSeat)
            })
        });
        // @ts-ignore
        await ReservableService.addOne(seatToAdd).then((result: Reservable|undefined)=>{
            expect(result).toMatchObject(addedSeat);
        })

    });

});

describe('get by id', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let gottenSeat = new Seat("reservable id");
        apiService.getReservableById = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(gottenSeat)
            })
        });
        // @ts-ignore
        await ReservableService.getById("reservable id").then((result: Reservable|undefined)=>{
            expect(result).toMatchObject(gottenSeat);
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