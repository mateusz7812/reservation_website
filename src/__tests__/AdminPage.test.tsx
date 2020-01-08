import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import React from "react";
import AccountModel from "../dataModels/AccountModel";
import AdminPage from "../components/adminPage/AdminPage";
import Adapter from "enzyme-adapter-react-16";
import AdminMenu from "../components/adminPage/AdminMenu";
import EventAdminPage from "../components/adminPage/EventAdminPage";
import AccountAdminPage from "../components/adminPage/AccountAdminPage";
import ReservableAdminPage from "../components/adminPage/ReservableAdminPage";
import ReservationAdminPage from "../components/adminPage/ReservationAdminPage";
import AdminAddReservationManager from "../components/adminPage/AdminAddReservationManager";
import ReservationModel from "../dataModels/ReservationModel";
import ReservationLabel from "../components/itemView/ReservationLabel";
import ReservationList from "../components/ReservationList";
import EventModel from "../dataModels/EventModel";
import {SeatModel} from "../dataModels/ReservableModel";

configure({adapter: new Adapter()});

it('AdminPage on /admin', () => {
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(() => true);
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    let wrapper = mount(
        <MemoryRouter initialEntries={['/admin']}>
            <App/>
        </MemoryRouter>
    );

    wrapper.update();
    expect(wrapper.find(AdminPage)).toHaveLength(1);
});

it('admin page contains menu', () => {
    let wrapper = mount(
        <MemoryRouter>
            <AdminPage/>
        </MemoryRouter>
    );
    expect(wrapper.find(AdminMenu)).toHaveLength(1);
});

it('admin menu contains buttons', () => {
    let wrapper = mount(
        <AdminMenu redirectTo={(path) => {
        }}/>
    );

    expect(wrapper.find('#eventsButton').last()).toHaveLength(1);
    expect(wrapper.find('#accountsButton').last()).toHaveLength(1);
    expect(wrapper.find('#reservablesButton').last()).toHaveLength(1);
    expect(wrapper.find('#reservationsButton').last()).toHaveLength(1);
});

it('adminMenu buttons work', (done) => {
    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin"]}>
            <Switch>
                <Route to="/admin" component={AdminPage}/>
            </Switch>
        </MemoryRouter>
    );
    const eventsButton = wrapper.find('#eventsButton').last();
    expect(eventsButton).toHaveLength(1);
    eventsButton.simulate('click');
    setTimeout(() => {
        wrapper.update();
        expect(wrapper.find(EventAdminPage)).toHaveLength(1);

        const accountsButton = wrapper.find('#accountsButton').last();
        expect(accountsButton).toHaveLength(1);
        accountsButton.simulate('click');
        setTimeout(() => {
            wrapper.update();
            expect(wrapper.find(AccountAdminPage)).toHaveLength(1);

            const reservablesButton = wrapper.find('#reservablesButton').last();
            expect(reservablesButton).toHaveLength(1);
            reservablesButton.simulate('click');
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.find(ReservableAdminPage)).toHaveLength(1);

                const reservationsButton = wrapper.find('#reservationsButton').last();
                expect(reservationsButton).toHaveLength(1);
                reservationsButton.simulate('click');
                setTimeout(() => {
                    wrapper.update();
                    expect(wrapper.find(ReservationAdminPage)).toHaveLength(1);
                    done();
                }, 10);
            }, 10);
        }, 10);
    }, 10);
});

it('reservations page list loading', (done) => {
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let reservations = [new ReservationModel({"id": "reservation1", "account": "account1", "event": "event1", "reservable": {"type": "Seat", "id": "seat1"}})];
    let reservationAccount = new AccountModel({"id": "account1"});
    let reservationEvent = new EventModel({"id": "event1"});
    let reservationSeat = new SeatModel({"id": "seat1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    let reservationService = require("../services/ReservationService");
    reservationService.default.getAll = jest.fn(()=>Promise.resolve(reservations));

    let accountService = require("../services/AccountService");
    accountService.default.getById = jest.fn(()=>Promise.resolve(reservationAccount));

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(reservationEvent));

    let reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=>Promise.resolve(reservationSeat));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservation"]}>
            <ReservationAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(reservationService.default.getAll).toHaveBeenCalled();
        expect(accountService.default.getById).toHaveBeenCalled();
        expect(eventService.default.getById).toHaveBeenCalled();
        expect(reservableService.default.getById).toHaveBeenCalled();
        expect(reservationService.default.getAll).toHaveBeenCalled();
        expect(wrapper.find(ReservationList)).toHaveLength(1);
        expect(wrapper.find(ReservationLabel)).toHaveLength(1);
        done();
    }, 100);

});

it('add reservations', (done) => {
    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservation"]}>
            <Switch>
                <Route to="/admin" component={AdminPage}/>
            </Switch>
        </MemoryRouter>
    );

    let addButton = wrapper.find({"id": "addButton"});
    expect(addButton).toHaveLength(1);
    addButton.simulate('click');

    setTimeout(() => {
        wrapper.update();
        expect(wrapper.find(AdminAddReservationManager)).toHaveLength(1);
        done();
    }, 10);

});