import EventModel from "../dataModels/EventModel";
import {configure, mount, shallow} from "enzyme";
import {MemoryRouter} from "react-router-dom";
import App from "../App";
import EventPage from "../components/EventPage";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import ReservablesTable from "../components/ReservablesTable";
import EventView from "../components/EventView";
import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import SeatView from "../components/SeatView";
import ReservableView from "../components/ReservableView";
import SpaceView from "../components/SpaceView";

configure({ adapter: new Adapter() });

it('eventPage at /event/:id', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.getCookie = jest.fn((value)=>{
        if(value === "token"){
            return "BZ3BL34T3FrSJJP0Pmm7O";
        }
    });
    let event = new EventModel({"id": "some id", "name": "event1", "reservables": []});

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=> Promise.resolve(event));

    let wrapper = mount(
        <MemoryRouter initialEntries={[ '/event/'+event.id]}>
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
        expect(wrapper.find(ReservablesTable)).toHaveLength(1);
        expect(eventService.default.getById).toHaveBeenCalled();
        expect(reservableService.default.getById).toHaveBeenCalled();
        done();
    }, 2000);
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
        let wrapper = mount(<ReservablesTable reservablePromise={reservableService.default.getById("seat1")}/>);

        setTimeout(()=> {
            wrapper.update();
            expect(wrapper.find(SeatView)).toHaveLength(1);
            done();
        }, 2000);

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
        reservableService.default.getById = jest.fn((id)=>
            {

                Promise.resolve(reservables.filter(r=>r.id === id)[0])
            });

        // @ts-ignore
        let wrapper = mount(<ReservablesTable reservablePromise={reservableService.default.getById("space1")}/>);

        setTimeout(()=> {
            wrapper.update();
            let spaces = wrapper.find(SpaceView);
            expect(spaces).toHaveLength(2);
            let seats = wrapper.find(SeatView);
            expect(seats).toHaveLength(2);
            done();
        }, 2000);

    });

