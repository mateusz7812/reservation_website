import AccountModel from "../dataModels/AccountModel";
import EventModel from "../dataModels/EventModel";
import {SeatModel} from "../dataModels/ReservableModel";
import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import ReservationModel from "../dataModels/ReservationModel";
import ReservationLabel from "../components/itemView/ReservationLabel";
import AdminReservationIdPage from "../components/adminPage/AdminReservationIdPage";

configure({ adapter: new Adapter() });

it('reservationIdPage at /admin/reservation/:id', (done)=>{
    let account = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservation/reservation1"]}>
            <App/>
        </MemoryRouter>
    );

    expect(wrapper.find(AdminReservationIdPage)).toHaveLength(1);
    done();
});


it('reservation data loaded', (done)=>{
    let accountModel = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});
    const eventModel = new EventModel({id: "event1", name: "event1", reservations:["reservation1", "reservation2"], startDate: 1578960000, endDate: 1579046340});
    const reservableModel = new SeatModel({id: "seat1", name: "seat1"});
    const reservationModel = new ReservationModel({id: "reservation1", event: "event1", account: "account1", reservable: "seat1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>accountModel);

    let match= { params: {id: "event1"}};

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(eventModel));

    let accountService = require("../services/AccountService");
    accountService.default.getById = jest.fn(()=>Promise.resolve(accountModel));

    let reservationService = require("../services/ReservationService");
    reservationService.default.getById = jest.fn(()=>Promise.resolve(reservationModel));

    let reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=>Promise.resolve(reservableModel));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/" component=
                    {(props: any)=>
                        <AdminReservationIdPage {...props}
                            // @ts-ignore
                                            match={match}/>
                    }
                />
            </Switch>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();

        expect(reservableService.default.getById).toHaveBeenCalled();
        expect(reservationService.default.getById).toHaveBeenCalled();
        expect(accountService.default.getById).toHaveBeenCalled();
        expect(eventService.default.getById).toHaveBeenCalled();

        expect(wrapper.find(ReservationLabel)).toHaveLength(1);
        done();
    }, 10);
});





