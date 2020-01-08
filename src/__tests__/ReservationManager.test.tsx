import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import {configure, mount, ReactWrapper} from "enzyme";
import React from "react";
import UserAddReservationManager from "../components/reservationManager/UserAddReservationManager";
import Adapter from "enzyme-adapter-react-16";
import SeatView from "../components/itemView/SeatView";
import SelectedReservablesList from "../components/reservationManager/SelectedReservablesList";
import SpaceView from "../components/itemView/SpaceView";
import ReservationModel from "../dataModels/ReservationModel";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import ReservingPage from "../components/ReservingPage";
import SeatLabel from "../components/itemView/SeatLabel";
import SpaceLabel from "../components/itemView/SpaceLabel";
import AccountModel from "../dataModels/AccountModel";
import AddReservationManager from "../components/reservationManager/AddReservationManager";
import AccountList from "../components/AccountList";
import AccountView from "../components/itemView/AccountView";
import EventList from "../components/EventList";
import EventModel from "../dataModels/EventModel";

configure({ adapter: new Adapter() });

it('accountList works', ()=>{
    let accountsDict = {"account1": new AccountModel({"id": "account1", "login": "account1"})};
    let callWithId = jest.fn();

    let wrapper = mount(<AccountList accounts={accountsDict} callWithId={callWithId}/>);

    const accountView = wrapper.find(AccountView);
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
    let event = new EventModel({"id": "event1", "reservable": new SeatModel({"id": "seat1"})});

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
    let event = new EventModel({"id": "event1", "reservable": seat});

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

        wrapper.update();
        const selectedReservablesList: ReactWrapper<any, any> = wrapper.find(SelectedReservablesList);
        expect(selectedReservablesList).toHaveLength(1);
        let selectedSeats = selectedReservablesList.find(SeatLabel);
        expect(selectedSeats).toHaveLength(1);
        selectedSeats.first().simulate('click');

        wrapper.update();
        const selectedReservablesList2: ReactWrapper<any, any> = wrapper.find(SelectedReservablesList);
        expect(selectedReservablesList2).toHaveLength(1);
        let selectedSeats2 = selectedReservablesList2.find(SeatLabel);
        expect(selectedSeats2).toHaveLength(0);
        done();
    }, 10);
});


it('reservablesTable seat loading', (done)=>{
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    let event = new EventModel({"id": "event1", "reservable": seat});
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
    let wrapper = mount(<SelectedReservablesList selectedReservablesIds={[seat.id as string, space.id as string]} allReservables={{"seat1": seat, "space1":space}} selectionChanger={selectionChanger} />);
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
        new SeatModel({"id": "seat1", "name": "seat1"}),
        new SeatModel({"id": "seat2", "name": "seat2"}),
        new SpaceModel({"id": "space1", "name": "space1", "reservables": ["space2", "seat1"]}),
        new SpaceModel({"id": "space2", "name": "space2", "reservables": ["seat2"]})];

    let event = new EventModel({"id": "event1", "reservable": reservables[2]});
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
    let event = new EventModel({"id": "event1", "reservable": seat});
    let account = new AccountModel({"id": "account1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.getAccount = jest.fn(()=>account);

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=>Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    const reservationService = require("../services/ReservationService");
    reservationService.default.addOne = jest.fn();

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/reserving" component={ReservingPage}/>
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
            expect(wrapper.find(ReservingPage)).toHaveLength(1);
            expect(reservationService.default.addOne).toHaveBeenCalled();
            let calls = reservationService.default.addOne.mock.calls;
            const callArg = calls[0][0];
            expect(callArg instanceof ReservationModel).toBeTruthy();
            expect((callArg as ReservationModel).account).toBe("account1");
            expect((callArg as ReservationModel).event).toBe("event1");
            expect((callArg as ReservationModel).reservable).toMatchObject({"id": "seat1", "type": "Seat"});
            wrapper.update();
            expect(wrapper.find(SeatLabel)).toHaveLength(1);
            done();
        }, 3000);

    }, 10);
});