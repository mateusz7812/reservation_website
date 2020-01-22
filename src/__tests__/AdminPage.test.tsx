import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import React from "react";
import AccountModel from "../dataModels/AccountModel";
import AdminPage from "../components/adminPage/AdminPage";
import Adapter from "enzyme-adapter-react-16";
import AdminMenu from "../components/adminPage/AdminMenu";
import EventAdminPage from "../components/adminPage/AdminEventPage";
import AccountAdminPage from "../components/adminPage/AccountAdminPage";
import ReservableAdminPage from "../components/adminPage/AdminReservablePage";
import ReservationAdminPage from "../components/adminPage/AdminReservationPage";
import ReservationModel from "../dataModels/ReservationModel";
import ReservationLabel from "../components/itemView/ReservationLabel";
import ReservationList from "../components/ReservationList";
import EventModel from "../dataModels/EventModel";
import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import EventList from "../components/EventList";
import AdminAddEventManager from "../components/adminPage/AdminAddEventManager";
import AccountList from "../components/AccountList";
import ReservableList from "../components/ReservableList";
import AdminAddAccountManager from "../components/adminPage/AdminAddAccountManager";
import AdminAddReservableManager from "../components/adminPage/AdminAddReservableManager";
import EventLabel from "../components/itemView/EventLabel";
import AccountLabel from "../components/itemView/AccountLabel";
import ReservableLabel from "../components/itemView/ReservableLabel";
import AdminReservableIdView from "../components/adminPage/AdminReservableIdView";
import AdminReservationIdView from "../components/adminPage/AdminReservationIdView";

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
        <AdminMenu redirectTo={() => {
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

it('accountPage loading', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let accounts = [new AccountModel({"id": "1", "login": "user1"})];

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    let accountService = require("../services/AccountService");
    accountService.default.getAll = jest.fn(()=>Promise.resolve(accounts));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/account"]}>
            <AccountAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        expect(wrapper.find(AccountList)).toHaveLength(1);
        expect(accountService.default.getAll).toHaveBeenCalled();
        done();
    }, 100);
});

it('accountPage idPage loading', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let account = new AccountModel({"id": "c293144c-5d4d-49ac-ae79-d7c9bbc4442a", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});

    let reservations = [new ReservationModel({id: "reservation1", account: "account1", event: "event1", reservable: "reservable1"}),
        new ReservationModel({id: "reservation2", account: "account1", event: "event2", reservable: "reservable2"})];

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    let accountService = require("../services/AccountService");
    accountService.default.getAll = jest.fn(()=>Promise.resolve([account]));

    const reservationService = require("../services/ReservationService");
    reservationService.default.getById = jest.fn((id)=>
        Promise.resolve(reservations.filter((reservation)=>reservation.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/account/c293144c-5d4d-49ac-ae79-d7c9bbc4442a"]}>
            <AccountAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(AccountLabel)).toHaveLength(1);
        expect(wrapper.find(ReservationLabel)).toHaveLength(2);
        expect(accountService.default.getAll).toHaveBeenCalled();
        expect(reservationService.default.getById).toHaveBeenCalledTimes(2);
        done();
    }, 1000);
});

it('ReservablePage reservables loading', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let reservables = [new SeatModel({"id": "1", "name": "seat1"}), new SpaceModel({"id": "2", "name": "space1"})];

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    let reservableService = require("../services/ReservableService");
    reservableService.default.getAll = jest.fn(()=>Promise.resolve(reservables));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservable"]}>
            <ReservableAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        expect(wrapper.find(ReservableList)).toHaveLength(1);
        expect(reservableService.default.getAll).toHaveBeenCalled();
        done();
    }, 100);
});

it('ReservablePage reservableIdSubPage loading', (done)=>{
    let accountModel = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});
    const reservableModel = new SeatModel({id: "c293144c-5d4d-49ac-ae79-d7c9bbc4442a", name: "seat1", events: ["event1", "event2", "event3"]});
    const events = [
        new EventModel({id:"event1", name:"event1", startDate: 1577132800, endDate: 1577219199}),
        new EventModel({id:"event2", name:"event2", startDate: 1578132800, endDate: 1578219199}),
        new EventModel({id:"event3", name:"event3", startDate: 1579132800, endDate: 1579219199})
    ];

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>accountModel);

    let reservableService = require("../services/ReservableService");
    reservableService.default.getAll = jest.fn(()=>Promise.resolve([reservableModel]));

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn((id: string) =>
        Promise.resolve(
            events.filter((event: EventModel)=> event.id === id)[0]
        )
    );
    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservable/c293144c-5d4d-49ac-ae79-d7c9bbc4442a"]}>
            <ReservableAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(reservableService.default.getAll).toHaveBeenCalled();
        expect(eventService.default.getById).toHaveBeenCalledTimes(3);

        expect(wrapper.find(ReservableLabel)).toHaveLength(1);
        expect(wrapper.find(EventLabel)).toHaveLength(3);
        done();
    }, 100);
});

it('eventPage events loading', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let events = [new EventModel({"id": "event1"})];

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    let eventService = require("../services/EventService");
    eventService.default.getAll = jest.fn(()=>Promise.resolve(events));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/event"]}>
            <EventAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        expect(wrapper.find(EventList)).toHaveLength(1);
        expect(eventService.default.getAll).toHaveBeenCalled();
        done();
    }, 100);
});

it('eventPage eventId loading', (done)=> {
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let event = new EventModel({id: "c293144c-5d4d-49ac-ae79-d7c9bbc4442a", name: "name"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    const eventService = require("../services/EventService");
    eventService.default.getAll = jest.fn(()=>Promise.resolve([event]));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/event/c293144c-5d4d-49ac-ae79-d7c9bbc4442a"]}>
            <EventAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=> {
        wrapper.update();
        expect(eventService.default.getAll).toHaveBeenCalled();
        expect(wrapper.find(EventLabel)).toHaveLength(1);
        done();
    }, 1000);
});

it('eventPage event adding', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    const adminAddEventManager = require("../components/adminPage/AdminAddEventManager");
    adminAddEventManager.default = () => <div/>;

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/event/add"]}>
            <EventAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(EventList)).toHaveLength(0);
        expect(wrapper.find(AdminAddEventManager)).toHaveLength(1);
        done();
    }, 100);
});

it('accountPage account adding', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    const adminAddAccountManager = require("../components/adminPage/AdminAddAccountManager");
    adminAddAccountManager.default = () => <div/>;

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/account/add"]}>
            <AccountAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(AccountList)).toHaveLength(0);
        expect(wrapper.find(AdminAddAccountManager)).toHaveLength(1);
        done();
    }, 100);
});

it('reservablePage reservable adding', (done)=>{
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(() => adminAccount);

    const adminAddReservableManager = require("../components/adminPage/AdminAddReservableManager");
    adminAddReservableManager.default = () => <div/>;

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservable/add"]}>
            <ReservableAdminPage/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(ReservableList)).toHaveLength(0);
        expect(wrapper.find(AdminAddReservableManager)).toHaveLength(1);
        done();
    }, 100);
});

it('reservations page list loading', (done) => {
    let adminAccount = new AccountModel({"id": "admin", "login": "admin", "roles": ["ROLE_ADMIN"]});
    let reservations = [new ReservationModel({"id": "reservation1", "account": "account1", "event": "event1", "reservable": "seat1"})];
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
                           <AdminReservableIdView {...props} match={match}/>
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

it('reservationIdView loaded', (done)=>{
    let accountModel = new AccountModel({"id": "account1", "login": "account1", "roles": ["ROLE_ADMIN"], "reservations": ["reservation1", "reservation2"]});
    const eventModel = new EventModel({id: "event1", name: "event1", reservations:["reservation1", "reservation2"], startDate: 1578960000, endDate: 1579046340});
    const reservableModel = new SeatModel({id: "seat1", name: "seat1"});
    const reservationModel = new ReservationModel({id: "c293144c-5d4d-49ac-ae79-d7c9bbc4442a", event: "event1", account: "account1", reservable: "seat1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);
    cookieService.default.getAccount = jest.fn(()=>accountModel);

    let eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(eventModel));

    let accountService = require("../services/AccountService");
    accountService.default.getById = jest.fn(()=>Promise.resolve(accountModel));

    let reservationService = require("../services/ReservationService");
    reservationService.default.getAll = jest.fn(()=>Promise.resolve([reservationModel]));

    let reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=>Promise.resolve(reservableModel));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/admin/reservation/c293144c-5d4d-49ac-ae79-d7c9bbc4442a"]}>
            <ReservationAdminPage/>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();

        expect(reservableService.default.getById).toHaveBeenCalled();
        expect(reservationService.default.getAll).toHaveBeenCalled();
        expect(accountService.default.getById).toHaveBeenCalled();
        expect(eventService.default.getById).toHaveBeenCalled();

        expect(wrapper.find(AdminReservationIdView)).toHaveLength(1);
        done();
    }, 10);
});

