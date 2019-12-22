import EventModel from "../dataModels/EventModel";
import {configure, mount, ReactWrapper, shallow} from "enzyme";
import {MemoryRouter} from "react-router-dom";
import App from "../App";
import EventPage from "../components/EventPage";
import React, {Component} from "react";
import Adapter from "enzyme-adapter-react-16";
import ReservationManager from "../components/ReservationManager";
import EventView from "../components/EventView";
import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import SeatView from "../components/SeatView";
import ReservableView from "../components/ReservableView";
import SpaceViewExtended from "../components/SpaceViewExtended";
import SelectedReservablesList from "../components/SelectedReservablesList";

configure({ adapter: new Adapter() });

it('eventPage at /event/:id', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.getToken = jest.fn(()=>{
        return "BZ3BL34T3FrSJJP0Pmm7O";
    });

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
    const cookieService = require('../services/CookieService');
    cookieService.getToken = jest.fn(()=>{
            return "BZ3BL34T3FrSJJP0Pmm7O";
    });
    let match= { params: {id: "event1"}};
    let event = new EventModel({"id": "event1", "name": "event1name", "reservables": []});
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    // @ts-ignore

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=> Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(<EventPage
        // @ts-ignore
        match={match}/>);

    setTimeout(()=> {
        wrapper.update();
        let eventViewWrapper = wrapper.find(EventView);
        expect(eventViewWrapper).toHaveLength(1);
        expect(eventViewWrapper.html().includes("event1name")).toBeTruthy();
        expect(wrapper.find(ReservationManager)).toHaveLength(1);
        expect(eventService.default.getById).toHaveBeenCalled();
        expect(reservableService.default.getById).toHaveBeenCalled();
        done();
    }, 10);
});

it('reservables added to selected reservables list after click and removed after next', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.getToken = jest.fn(()=>{
            return "BZ3BL34T3FrSJJP0Pmm7O";
    });
    let match= { params: {id: "event1"}};
    let event = new EventModel({"id": "event1", "name": "event1name", "reservables": []});
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    // @ts-ignore

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=> Promise.resolve(event));

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(<EventPage
        // @ts-ignore
        match={match}/>);

    setTimeout(()=> {
        wrapper.update();
        const seatsViews: ReactWrapper<any, any> = wrapper.find({"className": "seatView"});
        expect(seatsViews).toHaveLength(1);
        let seatView = seatsViews.first();
        seatView.simulate('click');

        wrapper.update();
        const selectedReservablesList: ReactWrapper<any, any> = wrapper.find({"id": "selectedReservablesList"});
        expect(selectedReservablesList).toHaveLength(1);
        let selectedSeats = selectedReservablesList.find({"className": "seatView"});
        expect(selectedSeats).toHaveLength(1);
        selectedSeats.first().simulate('click');

        wrapper.update();
        const selectedReservablesList2: ReactWrapper<any, any> = wrapper.find({"id": "selectedReservablesList"});
        expect(selectedReservablesList2).toHaveLength(1);
        let selectedSeats2 = selectedReservablesList2.find({"className": "seatView"});
        expect(selectedSeats2).toHaveLength(0);
        done();
    }, 10);
});

it('reservablesTable seat loading', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.getToken = jest.fn(()=>{
        return "BZ3BL34T3FrSJJP0Pmm7O";
    });
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    // @ts-ignore
    let wrapper = mount(<ReservationManager reservablePromise={reservableService.default.getById("seat1")}/>);

    setTimeout(()=> {
        wrapper.update();
        expect(wrapper.find(SeatView)).toHaveLength(1);
        done();
    }, 10);

});

it('selectedReservablesList', (done)=>{
    const selectionChanger = jest.fn(()=>{});
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    let space = new SpaceModel({"id": "space1", "name": "space1", "reservables": []});
    let wrapper = mount(<SelectedReservablesList selectedReservablesIds={[seat.id as string, space.id as string]} allReservables={{"seat1": seat, "space1":space}} selectionChanger={selectionChanger} />);
    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(SeatView)).toHaveLength(1);
        expect(wrapper.find(SpaceViewExtended)).toHaveLength(1);
        wrapper.find({"className": "seatView"}).first().simulate('click');
        expect(selectionChanger).toBeCalledWith("seat1");
        done();
    }, 10);
});

it('reservableTable space loading', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.getToken = jest.fn(()=>{
        return "BZ3BL34T3FrSJJP0Pmm7O";
    });

    let reservables = [
        new SeatModel({"id": "seat1", "name": "seat1"}),
        new SeatModel({"id": "seat2", "name": "seat2"}),
        new SpaceModel({"id": "space1", "name": "space1", "reservables": ["space2", "seat1"]}),
        new SpaceModel({"id": "space2", "name": "space2", "reservables": ["seat2"]})];

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn((id)=> Promise.resolve(reservables.filter(r=>r.id === id)[0]));

    // @ts-ignore
    let wrapper = mount(<ReservationManager reservablePromise={reservableService.default.getById("space1")}/>);

    setTimeout(()=> {
        wrapper.update();
        let spaces = wrapper.find(SpaceViewExtended);
        expect(spaces).toHaveLength(2);
        let seats = wrapper.find(SeatView);
        expect(seats).toHaveLength(2);
        done();
    }, 10);

});

