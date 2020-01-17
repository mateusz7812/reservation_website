import AccountModel from "../dataModels/AccountModel";
import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import ReservationModel from "../dataModels/ReservationModel";
import AdminAccountIdPage from "../components/adminPage/AdminAccountIdPage";
import AccountLabel from "../components/itemView/AccountLabel";
import ReservationLabel from "../components/itemView/ReservationLabel";

configure({ adapter: new Adapter() });

it('accountPage at /admin/account/:id', (done)=>{
    let account = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/account/account1"]}>
            <App/>
        </MemoryRouter>
    );

    expect(wrapper.find(AdminAccountIdPage)).toHaveLength(1);
    done();
});


it('account data loaded', (done)=>{
    let account = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});

    let reservations = [new ReservationModel({id: "reservation1", account: "account1", event: "event1", reservable: "reservable1"}),
        new ReservationModel({id: "reservation2", account: "account1", event: "event2", reservable: "reservable2"})];

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>account);

    let match= { params: {id: "account1"}};

    const accountService = require("../services/AccountService");
    accountService.default.getById = jest.fn(()=> Promise.resolve(account));

    const reservationService = require("../services/ReservationService");
    reservationService.default.getById = jest.fn((id)=>
        Promise.resolve(reservations.filter((reservation)=>reservation.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/" component=
                    {(props: any)=>
                        <AdminAccountIdPage {...props}
                            // @ts-ignore
                                            match={match}/>
                    }
                />
            </Switch>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        expect(wrapper.find(AccountLabel)).toHaveLength(1);
        expect(wrapper.find(ReservationLabel)).toHaveLength(2);
        expect(accountService.default.getById).toHaveBeenCalled();
        expect(reservationService.default.getById).toHaveBeenCalledTimes(2);
        done();
    }, 10);
});





