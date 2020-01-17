import AccountModel from "../dataModels/AccountModel";
import EventModel from "../dataModels/EventModel";
import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import AdminEventIdPage from "../components/adminPage/AdminEventIdPage";
import EventLabel from "../components/itemView/EventLabel";

configure({ adapter: new Adapter() });

it('eventIdPage at /admin/event/:id', (done)=>{
    let account = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/event/event1"]}>
            <App/>
        </MemoryRouter>
    );

    expect(wrapper.find(AdminEventIdPage)).toHaveLength(1);
    done();
});


it('event data loaded', (done)=>{
    let account = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});
    const eventModel = new EventModel({id: "event1", name: "event1", reservations:["reservation1", "reservation2"], startDate: 1578960000, endDate: 1579046340});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let match= { params: {id: "event1"}};

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(eventModel));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/" component=
                    {(props: any)=>
                        <AdminEventIdPage {...props}
                            // @ts-ignore
                                            match={match}/>
                    }
                />
            </Switch>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        expect(wrapper.find(EventLabel)).toHaveLength(1);
        expect(eventService.default.getById).toHaveBeenCalled();
        done();
    }, 10);
});





