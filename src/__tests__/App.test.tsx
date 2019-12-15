import React from 'react';
import App from '../App';
import {configure, mount, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import LoginPage from "../components/LoginPage";
import {MemoryRouter, Redirect, Route, Switch} from "react-router-dom";
import HomePage from "../components/HomePage";
import RegisterForm from "../components/RegisterForm";
import RegisterPage from "../components/RegisterPage";
import LoginForm from "../components/LoginForm";
import PrivateRoute from "../PrivateRoute";
import EventList from "../components/EventList";
import Account from "../dataModels/Account";
import Event from "../dataModels/Event";
import OneEventView from "../components/Event" ;
import EventPage from "../components/EventPage";
import {Reservable, Seat} from "../dataModels/Reservable";
import ReservablesTable from "../components/ReservablesTable";
import OneReservableView from "../components/Reservable";

configure({ adapter: new Adapter() });
describe('loginPage', ()=>{
    it('loginPage at /login', ()=>{
        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/login']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(LoginPage)).toHaveLength(1);
    });

    it('loginForm in loginPage', ()=>{
        let wrapper = mount(<LoginPage/>);
        expect(wrapper.find(LoginForm)).toHaveLength(1);
    });

    it('loginForm call function', ()=>{
        const mockFunction = jest.fn();

        let wrapper = mount(<LoginForm loginFunction={mockFunction}/>);
        wrapper.find({'id': 'loginInput'}).getDOMNode()["value"] = "name";
        wrapper.find({'id': 'passwordInput'}).getDOMNode()["value"] = "password";
        wrapper.find({'id': "loginButton"}).simulate('click');

        expect(mockFunction.mock.calls.length).toEqual(1);
        expect(mockFunction.mock.calls[0][0]).toEqual("name");
        expect(mockFunction.mock.calls[0][1]).toEqual("password");

    });

    it('loginAccount on 200 status', (done)=>{
        let token = "BZ3BL34T3FrSJJP0Pmm7O";

        const cookieService = require('../services/CookieService');
        cookieService.addCookie = jest.fn((key, value)=>{
            expect(key).toBe("token");
            expect(value).toBe("BZ3BL34T3FrSJJP0Pmm7O");
        });

        const accountService = require("../services/AccountService");
        accountService.default.getTokenForAccount = jest.fn((account) => {
            expect(account.login).toEqual("user");
            expect(account.password).toEqual("password");
            return Promise.resolve(token);
        });

        shallow(<LoginPage />).instance().loginAccount("user", "password").then(
            r => {
                expect(accountService.default.getTokenForAccount.mock.calls.length).toEqual(1);
                expect(cookieService.addCookie.mock.calls.length).toEqual(1);
                expect(r).toMatchObject(<Redirect to='/home'/>);
                done();
            }
        );
    });

    it('loginAccount on other than 200 status', (done)=> {
        let response = undefined;

        const cookieService = require('../services/CookieService');
        cookieService.addCookie = jest.fn();

        const accountService = require("../services/AccountService");
        accountService.default.getTokenForAccount = jest.fn(() => Promise.resolve(response));

        let instance = shallow(<LoginPage />).instance();

        instance.loginAccount("user", "password").then(
            () => {
                expect(instance.state.message).toBe("error");
                expect(cookieService.addCookie.mock.calls.length).toEqual(0);
                done();
            }
        );
    });

    it('redirect to /home if cookie account exist', ()=>{
        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn(()=>  "BZ3BL34T3FrSJJP0Pmm7O" );

        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/getTokenFromApi']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(HomePage)).toHaveLength(1);
        expect(wrapper.find(LoginPage)).toHaveLength(0);

    });
});

describe('registerPage', ()=>{
    it('registerPage at /register', () => {
        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/register']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(RegisterPage)).toHaveLength(1);
    });

    it('registerForm in registerPage', ()=>{
        let wrapper = mount(<RegisterPage/>);
        expect(wrapper.find(RegisterForm)).toHaveLength(1);
    });

    it('addAccount form', ()=>{
        const mockFunction = jest.fn();

        let wrapper = mount(<RegisterForm registerFunction={mockFunction}/>);
        wrapper.find({'id': 'loginInput'}).getDOMNode()["value"] = "name";
        wrapper.find({'id': 'passwordInput'}).getDOMNode()["value"] = "password";
        wrapper.find({'id': "registerButton"}).simulate('click');

        expect(mockFunction.mock.calls.length).toEqual(1);
        expect(mockFunction.mock.calls[0][0]).toEqual("name");
        expect(mockFunction.mock.calls[0][1]).toEqual("password");
    });

    it('registerAccount when account created', (done)=> {
        let response = new Account({
            "id": "49241151-fb8c-4cb3-a551-85408cb4fe66",
            "reservations": [],
            "login": "user",
            "password": "password"
        });

        const accountService = require("../services/AccountService");
        accountService.default.addOne = jest.fn(() => Promise.resolve(response));

        shallow(<RegisterPage />).instance().registerAccount("user", "password").then(
            r => {
                expect(accountService.default.addOne.mock.calls.length).toEqual(1);
                expect(accountService.default.addOne.mock.calls[0][0]).toMatchObject(new Account({"login": "user", "password": 'password'}));
                expect(r).toMatchObject(<Redirect to='/login'/>);
                done();
            }
        );
    });

    it('registerAccount when account not created', (done)=> {
        let response = undefined;

        const accountService = require("../services/AccountService");
        accountService.default.addOne = jest.fn(() => Promise.resolve(response));

        let instance = shallow(<RegisterPage />).instance();
        instance.registerAccount("user", "password").then(
            () => {
                expect(instance.state.message).toBe("error");
                done();
            }
        );
    });

});

describe('homePage', ()=> {

    it('homePage at /', ()=>{

        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn((value)=>{
            if(value === "token"){
                return "BZ3BL34T3FrSJJP0Pmm7O";
            }
        });

        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/']}>
                <App/>
            </MemoryRouter>
        );

        expect(wrapper.find(HomePage)).toHaveLength(1);
    });


    it('redirecting to /getTokenFromApi if account cookie dont exist', ()=>{
        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn(()=> undefined );

        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(HomePage)).toHaveLength(0);
        expect(wrapper.find(LoginPage)).toHaveLength(1);
    });

    it('eventList in homePage', ()=>{
        let wrapper = shallow(<HomePage/>);
        expect(wrapper.find(EventList)).toHaveLength(1);
    });

    it('homePage is loading events at start', ()=>{
        let eventService = require("../services/EventService");
        let events = [new Event({"id": "id1", "name": "event1"}), new Event({"id": "id2", "name": "event2"})];
        eventService.default.getAll = jest.fn(()=> Promise.resolve(events));

        let wrapper = mount(<HomePage/>);
        let instance = wrapper.instance();

        setTimeout(() => expect(instance.state.events).toBe(events), 10);
    });

    it('eventList loadLists', ()=>{
        let events = [new Event({"id": "id1", "name": "event1"}), new Event({"id": "id2", "name": "event2"})];
        let wrapper = mount(<EventList events={events}/>);

        expect(wrapper.find(OneEventView)).toHaveLength(2);
    });

    it('click Event view was redirecting to event page ',()=>{
        let event = new Event({"id": "some id", "name": "event1"});
        let wrapper = mount(
            <MemoryRouter initialEntries={["/"]}>
                <Switch>
                    <Route path="/"><OneEventView event={event}/></Route>
                    <Route path="/event/:id"><EventPage/></Route>
                </Switch>
            </MemoryRouter>);
        expect(wrapper.find(EventPage)).toHaveLength(0);
        wrapper.simulate("click");
        setTimeout(() => expect(wrapper.find(EventPage)).toHaveLength(1), 10);
    });
});

describe('eventPage', ()=>{
    it('eventPage at /event/:id', ()=>{
        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn((value)=>{
            if(value === "token"){
                return "BZ3BL34T3FrSJJP0Pmm7O";
            }
        });
        let event = new Event({"id": "some id", "name": "event1"});
        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/event/'+event.id]}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(EventPage)).toHaveLength(1);
    });

    it('eventPage load event by id',(done)=>{
        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn((value)=>{
            if(value === "token"){
                return "BZ3BL34T3FrSJJP0Pmm7O";
            }
        });

        let event = new Event({"id": "some id", "name": "event1", "reservables": ["id 1", "id 2", "id 3"]});
        let reservables = [new Seat({"id": "id 1"}), new Seat({"id": "id 2"}), new Seat({"id": "id 3"})];

        let eventService = require("../services/EventService");
        eventService.default.getById = jest.fn(()=> Promise.resolve(event));

        let reservableService = require("../services/ReservableService");
        reservableService.default.getById = jest.fn((id: string)=> Promise.resolve(reservables.filter((x: Seat)=> x.id === id)[0]));

        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/event/'+event.id]}>
                <Switch>
                    <Route path="/event/:id" component={EventPage}/>
                </Switch>
            </MemoryRouter>
        );

        setTimeout(() => expect(eventService.default.getById.mock.calls).toHaveLength(1), 1000);
        expect(eventService.default.getById.mock.calls[0][0]).toBe(event.id);
        setTimeout(() => expect(reservableService.default.getById.mock.calls.length).toEqual(3), 1000);

        let instance = wrapper.find(EventPage).instance();

        setTimeout(() => expect(instance.state.event).toMatchObject(event), 1000);
        setTimeout(() => {expect(instance.state.reservables).toMatchObject(reservables); done()}, 1000);
    });

    it('reservablesTable test', ()=>{
        let reservables = [new Seat({"id": "id 1", "name": "seat1"})];
        let selections: Reservable[] = [];
        const setSelections = jest.fn((newSelections)=>{selections=newSelections});
        let wrapper = mount(<ReservablesTable reservables={reservables} selections={selections} setSelections={setSelections}/>);
        let reservableView = wrapper.find(OneReservableView);
        reservableView.simulate("click");
        expect(selections).toMatchObject(reservables);
    });
});