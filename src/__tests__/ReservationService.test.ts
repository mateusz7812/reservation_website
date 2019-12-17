import ReservationModel from "../dataModels/ReservationModel";
import {ReservableModel, SeatModel} from "../dataModels/ReservableModel";
import ReservableService from "../services/ReservableService";
import ReservationService from "../services/ReservationService";

describe('add one', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let reservableInAdding: ReservableModel = new SeatModel({ "id": "reservable id", "name": "reservable name"});
        let reservableInAdded: ReservableModel = new SeatModel({"id": "reservable id"});
        let reservationToAdd: ReservationModel = new ReservationModel({"account": "account id", "event": "event id", "reservable": reservableInAdding});
        let addedReservation: ReservationModel = new ReservationModel({"id": "reservation id", "account": "account id", "event": "event id", "reservable": reservableInAdded});
        const apiService = require('../domain/ApiRequests');
        apiService.addReservation = jest.fn((reservation: ReservationModel, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: addedReservation
            })
        });
        // @ts-ignore
        await ReservationService.addOne(reservationToAdd).then((result: ReservationModel|undefined)=>{
            expect(result).toMatchObject(addedReservation);
        })

    });

});

describe('get by id', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new SeatModel("reservable id");
        let reservation = new ReservationModel({"id": "reservation id", "account": "account id", "event": "event id", "reservable": seat});
        apiService.getReservationById = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                data: reservation
            })
        });
        // @ts-ignore
        await ReservationService.getById("id").then((result: ReservationModel|undefined)=>{
            expect(result).toMatchObject(reservation);
        })
    });

});

describe('update one', ()=>{
    it('correct', async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let id = "reservation id";
        let reservable = new SeatModel({"id": "reservable id"});
        let updateMap = new ReservationModel({"id": id, "event": "other event id"});
        let updatedReservation = new ReservationModel({"id": id, "account": "account id", "event": "other event id", "reservable": reservable});

        const apiService = require('../domain/ApiRequests');

        apiService.updateReservation = jest.fn(()=>{
            return Promise.resolve({
                status: 200,
                data: updatedReservation
            })
        });

        // @ts-ignore
        await ReservationService.updateOne(updateMap).then((result: ReservationModel|undefined)=>{
            expect(result).toMatchObject(updatedReservation);
        })
    });

    it('no id', async (done)=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let updateMap = new ReservationModel({"event": "other event id"});
        const apiService = require('../domain/ApiRequests');

        apiService.updateReservation = jest.fn(()=>{
            done.fail("request made")
        });

        // @ts-ignore
        expect(await ReservationService.updateOne(updateMap) === undefined).toBeTruthy();
        done();
    });
});

describe('delete by id', ()=>{
    it('',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");

        const apiService = require('../domain/ApiRequests');

        apiService.deleteReservationById=jest.fn((id: string, token)=>
        {
            return Promise.resolve({
                status: 200
            })
        });

        // @ts-ignore
        await ReservationService.deleteById("id").then((result: boolean)=>expect(result).toBeTruthy());

    });

});