import AccountModel from "../dataModels/AccountModel";
import EventModel from "../dataModels/EventModel";
import {SeatModel} from "../dataModels/ReservableModel";
import {configure, mount} from "enzyme";
import {MemoryRouter, Route} from "react-router-dom";
import App from "../App";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import EventLabel from "../components/itemView/EventLabel";
import ReservableLabel from "../components/itemView/ReservableLabel";
import AdminReservableIdPage from "../components/adminPage/AdminReservableIdPage";

configure({ adapter: new Adapter() });

it('reservableIdPage at /admin/reservable/:id', (done)=>{
    let account = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservable/reservable1"]}>
            <App/>
        </MemoryRouter>
    );

    setTimeout(()=> {
        wrapper.update();
        expect(wrapper.find(AdminReservableIdPage)).toHaveLength(1);
        done();
    }, 1000);

});


it('reservable data loaded', (done)=>{
    let accountModel = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});
    const reservableModel = new SeatModel({id: "seat1", name: "seat1", events: ["event1", "event2", "event3"]});
    const events = [
        new EventModel({id:"event1", name:"event1", startDate: 1577132800, endDate: 1577219199}),
        new EventModel({id:"event2", name:"event2", startDate: 1578132800, endDate: 1578219199}),
        new EventModel({id:"event3", name:"event3", startDate: 1579132800, endDate: 1579219199})
    ];

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>accountModel);

    let match= { params: {id: "seat1"}};

    let reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=>Promise.resolve(reservableModel));

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn((id: string) =>
        Promise.resolve(
            events.filter((event: EventModel)=> event.id === id)[0]
        )
    );

    let wrapper = mount(
        <MemoryRouter>
            <Route component=
                {(props: any)=>
                    <AdminReservableIdPage {...props} match={match}/>
                }
            />
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();

        expect(reservableService.default.getById).toHaveBeenCalled();
        expect(eventService.default.getById).toHaveBeenCalledTimes(3);

        expect(wrapper.find(ReservableLabel)).toHaveLength(1);
        expect(wrapper.find(EventLabel)).toHaveLength(3);
        done();
    }, 1000);
});





