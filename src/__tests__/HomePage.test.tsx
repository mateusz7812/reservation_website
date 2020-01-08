import {configure, mount, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import App from "../App";
import HomePage from "../components/HomePage";
import LoginPage from "../components/LoginPage";
import EventList from "../components/EventList";
import EventModel from "../dataModels/EventModel";
import OneEventView from "../components/itemView/EventView";
import EventPage from "../components/EventPage";
import React from "react";

configure({ adapter: new Adapter() });

it('homePage at /', ()=>{

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);

    let wrapper = mount(
        <MemoryRouter initialEntries={[ '/']}>
            <App/>
        </MemoryRouter>
    );

    expect(wrapper.find(HomePage)).toHaveLength(1);
});


it('redirecting to /login if account cookie dont exist', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>false);

    let wrapper = mount(
        <MemoryRouter initialEntries={[ '/']}>
            <App/>
        </MemoryRouter>
    );
    expect(wrapper.find(HomePage)).toHaveLength(0);
    expect(wrapper.find(LoginPage)).toHaveLength(1);
    done();
});

it('eventList in homePage', ()=>{
    let wrapper = shallow(<HomePage/>);
    expect(wrapper.find(EventList)).toHaveLength(1);
});

it('homePage is loading events at start', (done)=>{
    let eventService = require("../services/EventService");
    let events = [new EventModel({"id": "id1", "name": "event1"}), new EventModel({"id": "id2", "name": "event2"})];
    eventService.default.getAll = jest.fn(()=> Promise.resolve(events));

    let eventsDict: {[key: string]: EventModel} = {};
    events.forEach((event)=>eventsDict[event.id as string] = event);

    let wrapper = mount(
        <MemoryRouter>
            <HomePage/>
        </MemoryRouter>
    );
    let instance = wrapper.find(HomePage).instance() as HomePage;

    setTimeout(() => {
        expect(instance.state.events).toMatchObject(eventsDict);
        done();
    }, 10);
});

it('eventList loadLists', (done)=>{
    let events = [new EventModel({"id": "id1", "name": "event1"}), new EventModel({"id": "id2", "name": "event2"})];
    let eventsDict: {[key: string]: EventModel} = {};
    events.forEach((event)=>eventsDict[event.id as string] = event);

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <EventList events={eventsDict} callWithId={(_)=>{}}/>
            </Switch>
        </MemoryRouter>);

    expect(wrapper.find(OneEventView)).toHaveLength(2);
    done();
});

it('click EventView view was redirecting to event page ',async (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);

    let event = new EventModel({"id": "some_id", "name": "event1", "reservable": undefined});
    let eventsDict: {[key: string]: EventModel} = {};
    eventsDict[event.id as string] = event;

    const eventService = require("../services/EventService");
    eventService.default.getById = jest.fn(()=> Promise.resolve(event));
    eventService.default.getAll = jest.fn(()=> Promise.resolve([]));

    let mockRedirectToEventPage = jest.fn();

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn();

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path="/event/:id" component={EventPage} />
                <Route path="/" component={()=><EventList events={eventsDict} callWithId={mockRedirectToEventPage}/>} />
            </Switch>
        </MemoryRouter>
    );

    expect(wrapper.find(EventList)).toHaveLength(1);
    expect(wrapper.find(EventPage)).toHaveLength(0);
    let eventView = wrapper.find(OneEventView);
    let div = eventView.find('div');
    div.simulate('click');
    setTimeout(() => {
        expect(mockRedirectToEventPage).toHaveBeenCalledWith("some_id");
        done();
    }, 1000);
});
