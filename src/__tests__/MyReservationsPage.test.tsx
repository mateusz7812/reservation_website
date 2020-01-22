import MyReservationsPage from "../components/MyReservationsPage";
import {configure, mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import AccountModel from "../dataModels/AccountModel";
import {MemoryRouter} from "react-router-dom";
import App from "../App";
import ReservationModel from "../dataModels/ReservationModel";
import EventModel from "../dataModels/EventModel";
import {SeatModel} from "../dataModels/ReservableModel";
import ReservationLabel from "../components/itemView/ReservationLabel";

configure({ adapter: new Adapter() });

it('MyReservationsPage on /my_reservations', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/my_reservations"]}>
            <App/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();

        expect(wrapper.find(MyReservationsPage)).toHaveLength(1);
        done();
    });
});

it('MyReservationsPage loading data', (done)=>{
    let account = new AccountModel({"id": "account1", reservations: []});
    let updatedAccount = new AccountModel({"id": "account1", reservations: ["reservation1", "reservation2"]});

    let reservations = [new ReservationModel({id: "reservation1", event: "event1", reservable: "seat1"}), new ReservationModel({id: "reservation2", event: "event2", reservable: "seat2"})];
    let events = [new EventModel({id: "event1", name: "Event1"}), new EventModel({id: "event2", name: "Event2"})];
    let reservables = [new SeatModel({id: "seat1", name: "Seat1"}), new SeatModel({id: "seat2", name: "Seat2"})];

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let accountService = require("../services/AccountService");
    accountService.default.getById = jest.fn(()=>Promise.resolve(updatedAccount));

    let reservationService = require("../services/ReservationService");
    reservationService.default.getById = jest.fn((id)=>Promise.resolve(reservations.filter((reservation)=> reservation.id === id)[0]));

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn((id)=>Promise.resolve(events.filter((event)=> event.id === id)[0]));

    let reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn((id)=>Promise.resolve(reservables.filter((reservable)=> reservable.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/my_reservations"]}>
            <App/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();

        expect(accountService.default.getById).toHaveBeenCalledTimes(1);
        expect(reservationService.default.getById).toHaveBeenCalledTimes(2);
        expect(eventService.default.getById).toHaveBeenCalledTimes(2);
        expect(reservableService.default.getById).toHaveBeenCalledTimes(2);

        expect(wrapper.find(MyReservationsPage)).toHaveLength(1);
        expect(wrapper.find(ReservationLabel)).toHaveLength(2);
        done();
    }, 1000);
});