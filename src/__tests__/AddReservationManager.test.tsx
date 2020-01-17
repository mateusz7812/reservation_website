import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import {configure, mount, ReactWrapper} from "enzyme";
import React from "react";
import UserAddReservationManager from "../components/reservationManager/UserAddReservationManager";
import Adapter from "enzyme-adapter-react-16";
import SeatView from "../components/itemView/SeatView";
import SelectedReservablesList from "../components/reservationManager/SelectedReservablesList";
import SpaceView from "../components/itemView/SpaceView";
import ReservationModel from "../dataModels/ReservationModel";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import SeatLabel from "../components/itemView/SeatLabel";
import SpaceLabel from "../components/itemView/SpaceLabel";
import AccountModel from "../dataModels/AccountModel";
import AddReservationManager from "../components/reservationManager/AddReservationManager";
import AccountList from "../components/AccountList";
import AccountLabel from "../components/itemView/AccountLabel";
import EventList from "../components/EventList";
import EventModel from "../dataModels/EventModel";
import ReservableView from "../components/itemView/ReservableView";
import {DataContext} from "../components/reservationManager/DataContext";

configure({ adapter: new Adapter() });

it('accountList works', ()=>{
    let accountsDict = {"account1": new AccountModel({"id": "account1", "login": "account1"})};
    let callWithId = jest.fn();

    let wrapper = mount(<AccountList accounts={accountsDict} callWithId={callWithId}/>);

    const accountView = wrapper.find(AccountLabel);
    expect(accountView).toHaveLength(1);

    accountView.simulate('click');
    expect(callWithId).toHaveBeenCalledWith("account1");
});

it('account choose if not in props',()=>{
    let wrapper = mount(
        <MemoryRouter>
            <AddReservationManager/>
        </MemoryRouter>
    );

    expect(wrapper.find(AccountList)).toHaveLength(1);
});

it('event choose if not in props',()=>{
    let wrapper = mount(
        <MemoryRouter>
            <AddReservationManager accountId={"account1"}/>
        </MemoryRouter>
    );

    expect(wrapper.find(EventList)).toHaveLength(1);
});

it('loadEvent working', (done)=>{
    let event = new EventModel({"id": "event1", "reservable": "seat1"});

    const eventService = require('../services/EventService');
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    let wrapper = mount(
        <MemoryRouter>
            <AddReservationManager accountId={"account1"} eventId={"event1"}/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(eventService.default.getById).toHaveBeenCalledWith("event1");

        const withRouter = wrapper.find(AddReservationManager);
        const manager = withRouter.childAt(0);
        let reservationManager = manager.instance();

        // @ts-ignore
        expect(reservationManager.state.reservableId).toBe("seat1");
        done();
    }, 100);
});

it('reservables added to selected reservables list after click and removed after next', (done)=>{
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    let account = new AccountModel({"id": "accountId"});
    let event = new EventModel({"id": "event1", "reservable": seat.id});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/" component={()=>
                    <UserAddReservationManager eventId={event.id as string}/>
                }/>
            </Switch>
        </MemoryRouter>
        );

    setTimeout(()=> {
        wrapper.update();
        const seatsViews: ReactWrapper<any, any> = wrapper.find(SeatView);
        expect(seatsViews).toHaveLength(1);
        let seatView = seatsViews.first();
        seatView.simulate('click');

        setTimeout(()=>{

            wrapper.update();
            const selectedReservablesList: ReactWrapper<any, any> = wrapper.find(SelectedReservablesList);
            expect(selectedReservablesList).toHaveLength(1);
            let selectedSeats = selectedReservablesList.find(SeatLabel);
            expect(selectedSeats).toHaveLength(1);
            selectedSeats.first().simulate('click');

            setTimeout(()=>{

                wrapper.update();
                const selectedReservablesList2: ReactWrapper<any, any> = wrapper.find(SelectedReservablesList);
                expect(selectedReservablesList2).toHaveLength(1);
                let selectedSeats2 = selectedReservablesList2.find(SeatLabel);
                expect(selectedSeats2).toHaveLength(0);
                done();

            }, 1000);
        }, 1000);
    }, 1000);
});


it('reservablesTable seat loading', (done)=>{
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    let event = new EventModel({"id": "event1", "reservable": seat.id});
    let account = new AccountModel({"id": "accountId"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(
        <MemoryRouter>
            <UserAddReservationManager eventId={"event1"}/>
        </MemoryRouter>
    );

    setTimeout(()=> {
        wrapper.update();
        expect(wrapper.find(SeatView)).toHaveLength(1);
        done();
    }, 10);

});

it('selectedReservablesList', (done)=>{
    let account = new AccountModel({"id": "accountId"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const selectionChanger = jest.fn(()=>{});
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    let space = new SpaceModel({"id": "space1", "name": "space1", "reservables": []});
    const allReservables = new Map<string, ReservableModel>();
    allReservables.set("seat1", seat);
    allReservables.set("space1", space);
    let wrapper = mount(
        <DataContext.Provider value={{selectedReservablesIds: [seat.id as string, space.id as string], allReservables: allReservables, reservedReservablesIds: []}}>
            <SelectedReservablesList selectionChanger={selectionChanger}/>
        </DataContext.Provider>
            );
    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(SeatLabel)).toHaveLength(1);
        expect(wrapper.find(SpaceLabel)).toHaveLength(1);
        wrapper.find(SeatLabel).simulate('click');
        expect(selectionChanger).toBeCalledWith("seat1");
        done();
    }, 10);
});

it('reservableTable space loading', (done)=>{
    let reservables = [
        new SeatModel({"id": "seat1", "name": "seat1", reservations: []}),
        new SeatModel({"id": "seat2", "name": "seat2", reservations: []}),
        new SpaceModel({"id": "space1", "name": "space1", "reservables": ["space2", "seat1"], reservations: []}),
        new SpaceModel({"id": "space2", "name": "space2", "reservables": ["seat2"], reservations: []})];

    let event = new EventModel({"id": "event1", "reservable": reservables[2].id, reservations: []});
    let account = new AccountModel({"id": "accountId"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn((id)=> Promise.resolve(reservables.filter(r=>r.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter>
            <UserAddReservationManager eventId={"event1"}/>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        let spaces = wrapper.find(SpaceView);
        expect(spaces).toHaveLength(2);
        let seats = wrapper.find(SeatView);
        expect(seats).toHaveLength(2);
        done();
    }, 10);

});

it('make reservations', (done)=>{
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    let event = new EventModel({"id": "event1", "reservable": seat.id});
    let account = new AccountModel({"id": "account1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    const reservationService = require("../services/ReservationService");
    reservationService.default.addOne = jest.fn();

    // @ts-ignore
    const reservingPage = jest.fn(()=> <div/>);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/adding/reservation" component={reservingPage}/>
                <Route path="/" component={(props: any)=><UserAddReservationManager {...props} eventId={"event1"}/>}/>
            </Switch>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        const seatsViews: ReactWrapper<any, any> = wrapper.find(SeatView);
        expect(seatsViews).toHaveLength(1);
        let seatView = seatsViews.first();
        seatView.simulate('click');

        wrapper.update();
        let makeReservationButton = wrapper.find({"id":"reserveButton"});
        makeReservationButton.simulate('click');

        setTimeout(()=> {
            wrapper.update();
            expect(wrapper.find(reservingPage)).toHaveLength(1);
            // @ts-ignore
            expect(reservingPage.mock.calls[0][0].location.state.reservationsToAdd[0]).toMatchObject(new ReservationModel({"account": "account1", "event": "event1", "reservable": "seat1"}));
            // @ts-ignore
            expect(reservingPage.mock.calls[0][0].location.state.allReservables).toMatchObject({"seat1": seat});
            done();
        }, 10);

    }, 10);
});


it('select space when its seat is selected', (done)=>{
    jest.setTimeout(6000);
    let reservables = [
        new SeatModel({id: "seat1", name: "seat1"}),
        new SpaceModel({id: "space1", name: "space1", reservables: ["seat1"]})
    ];

    let event = new EventModel({"id": "event1", "reservable": "space1"});
    let account = new AccountModel({"id": "accountId"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn((id)=> Promise.resolve(reservables.filter(r=>r.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter>
            <UserAddReservationManager eventId={"event1"}/>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        wrapper.find(ReservableView).find(SeatView).simulate('click');

        setTimeout(()=>{
            wrapper.update();
            let selectedList = wrapper.find(SelectedReservablesList);
            expect(selectedList.find(SeatLabel)).toHaveLength(1);
            expect(selectedList.find(SpaceLabel)).toHaveLength(0);

            wrapper.find(ReservableView).find(SpaceView).find(SpaceLabel).simulate('click');
            setTimeout(()=>{
                wrapper.update();
                let selectedList = wrapper.find(SelectedReservablesList);
                expect(selectedList.find(SpaceLabel)).toHaveLength(1);
                expect(selectedList.find(SeatLabel)).toHaveLength(0);

                wrapper.find(ReservableView).find(SeatView).simulate('click');
                setTimeout(()=>{
                    wrapper.update();
                    let selectedList = wrapper.find(SelectedReservablesList);
                    expect(selectedList.find(SpaceLabel)).toHaveLength(1);
                    expect(selectedList.find(SeatLabel)).toHaveLength(0);
                    done();
                },1000);
            },1000);
        }, 1000);
    }, 1000);

});


it('select reserved seat', (done)=>{
    jest.setTimeout(6000);
    let reservables = [
        new SeatModel({id: "seat1", name: "seat1", reservations: ["reservation1"]}),
        new SpaceModel({id: "space1", name: "space1", reservables: ["seat1"]})
    ];

    let event = new EventModel({"id": "event1", "reservable": "space1", "reservations": ["reservation1"]});
    let account = new AccountModel({"id": "accountId"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn((id)=> Promise.resolve(reservables.filter(r=>r.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter>
            <UserAddReservationManager eventId={"event1"}/>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        wrapper.find(ReservableView).find(SeatView).simulate('click');

        setTimeout(()=>{
            wrapper.update();
            let selectedList = wrapper.find(SelectedReservablesList);
            expect(selectedList.find(SeatLabel)).toHaveLength(0);
            done();
        }, 1000);

    }, 1000);
});

it('select reserved space', (done)=>{
    jest.setTimeout(6000);
    let reservables = [
        new SeatModel({id: "seat1", name: "seat1"}),
        new SpaceModel({id: "space1", name: "space1", reservables: ["seat1"], reservations: ["reservation1"]})
    ];

    let event = new EventModel({"id": "event1", "reservable": "space1", "reservations": ["reservation1"]});
    let account = new AccountModel({"id": "accountId"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn((id)=> Promise.resolve(reservables.filter(r=>r.id === id)[0]));

    let wrapper = mount(
        <MemoryRouter>
            <UserAddReservationManager eventId={"event1"}/>
        </MemoryRouter>);

    setTimeout(()=> {
        wrapper.update();
        wrapper.find(ReservableView).find(SeatView).simulate('click');

        setTimeout(()=>{
            wrapper.update();
            let selectedList = wrapper.find(SelectedReservablesList);
            expect(selectedList.find(SeatLabel)).toHaveLength(0);
            done();
        }, 1000);

    }, 1000);
});