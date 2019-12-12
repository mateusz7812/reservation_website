import Reservation from "../dataModels/Reservation";
import {Reservable, Seat} from "../dataModels/Reservable";
import ReservableService from "../services/ReservableService";
import ReservationService from "../services/ReservationService";

describe('add one', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let reservableInAdding: Reservable = new Seat({ "id": "reservable id", "name": "reservable name"});
        let reservableInAdded: Reservable = new Seat({"id": "reservable id"});
        let reservationToAdd: Reservation = new Reservation({"account": "account id", "event": "event id", "reservable": reservableInAdding});
        let addedReservation: Reservation = new Reservation({"id": "reservation id", "account": "account id", "event": "event id", "reservable": reservableInAdded});
        const apiService = require('../domain/ApiRequests');
        apiService.addReservation = jest.fn((reservation: Reservation, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(addedReservation)
            })
        });
        // @ts-ignore
        await ReservationService.addOne(reservationToAdd).then((result: Reservation|undefined)=>{
            expect(result).toMatchObject(addedReservation);
        })

    });

});

describe('get by id', ()=>{
    it('correct',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');
        let seat = new Seat("reservable id");
        let reservation = new Reservation({"id": "reservation id", "account": "account id", "event": "event id", "reservable": seat});
        apiService.getReservationById = jest.fn((id: string, token: string)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(reservation)
            })
        });
        // @ts-ignore
        await ReservationService.getById("id").then((result: Reservation|undefined)=>{
            expect(result).toMatchObject(reservation);
        })
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