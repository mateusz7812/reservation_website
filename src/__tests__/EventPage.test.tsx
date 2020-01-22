import EventModel from "../dataModels/EventModel";
import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import EventPage from "../components/EventPage";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import ReservationManager from "../components/reservationManager/UserAddReservationManager";
import EventLabel from "../components/itemView/EventLabel";
import {SeatModel} from "../dataModels/ReservableModel";
import AccountModel from "../dataModels/AccountModel";

configure({ adapter: new Adapter() });

it('eventPage at /event/:id', (done)=>{
    let account = new AccountModel({"id": "account1", reservations:["reservation1"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let event = new EventModel({"id": "event1", "name": "event1name", "reservables": []});
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    // @ts-ignore

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=> Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/event/event1"]}>
            <App/>
        </MemoryRouter>
    );

    expect(wrapper.find(EventPage)).toHaveLength(1);
    done();
});

it('event data loaded', (done)=>{
    let account = new AccountModel({"id": "account1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let match= { params: {id: "event1"}};
    let event = new EventModel({"id": "event1", "name": "event1name", "reservables": []});
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    // @ts-ignore

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=> Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                    <Route path="/" component=
                        {(props: any)=>
                            <EventPage {...props}
                            // @ts-ignore
                            match={match}/>
                        }
                    />
            </Switch>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        let eventViewWrapper = wrapper.find(EventLabel);
        expect(eventViewWrapper).toHaveLength(1);
        expect(eventViewWrapper.html().includes("event1name")).toBeTruthy();
        expect(wrapper.find(ReservationManager)).toHaveLength(1);
        expect(eventService.default.getById).toHaveBeenCalled();
        expect(reservableService.default.getById).toHaveBeenCalled();
        done();
    }, 10);
});




