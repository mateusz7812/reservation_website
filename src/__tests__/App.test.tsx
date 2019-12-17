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
import EventList from "../components/EventList";
import AccountModel from "../dataModels/AccountModel";
import EventModel from "../dataModels/EventModel";
import OneEventView from "../components/EventView" ;
import EventPage from "../components/EventPage";
import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservableView from "../components/ReservableView";
import SeatView from "../components/SeatView";
import SpaceView from "../components/SpaceView";

configure({ adapter: new Adapter() });
describe('loginPage', ()=>{
    it('loginPage at /login', (done)=>{
        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/login']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(LoginPage)).toHaveLength(1);
        done();
    });

    it('loginForm in loginPage', ()=>{
        let wrapper = mount(<LoginPage/>);
        expect(wrapper.find(LoginForm)).toHaveLength(1);
    });

    it('loginForm call function', (done)=>{
        const mockFunction = jest.fn();

        let wrapper = mount(<LoginForm loginFunction={mockFunction}/>);
        wrapper.find({'id': 'loginInput'}).getDOMNode()["value"] = "name";
        wrapper.find({'id': 'passwordInput'}).getDOMNode()["value"] = "password";
        wrapper.find({'id': "loginButton"}).simulate('click');

        expect(mockFunction.mock.calls.length).toEqual(1);
        expect(mockFunction.mock.calls[0][0]).toEqual("name");
        expect(mockFunction.mock.calls[0][1]).toEqual("password");
        done();
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

    it('redirect to /home if cookie token exist', (done)=>{
        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn(()=>  "BZ3BL34T3FrSJJP0Pmm7O" );

        const eventService = require("../services/EventService");
        eventService.default.getAll = jest.fn(()=>Promise.resolve([]));

        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/login']}>
                <App/>
            </MemoryRouter>
        );
        expect(wrapper.find(LoginPage)).toHaveLength(0);
        expect(wrapper.find(HomePage)).toHaveLength(1);
        done();
    });
});

describe('registerPage', ()=>{
    it('registerPage at /register', async (done) => {

        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn((value)=>{
            if(value === "token"){
                return undefined;
            }
        });

        let wrapper = mount(
            <MemoryRouter initialEntries={[ '/register']}>
                <App/>
            </MemoryRouter>
        );
        setTimeout(()=>{
            expect(wrapper.find(RegisterPage)).toHaveLength(1);
            done();
        }, 1000);
    });

    it('registerForm in registerPage', ()=>{
        let wrapper = mount(<RegisterPage/>);
        expect(wrapper.find(RegisterForm)).toHaveLength(1);
    });

    it('addAccount form', (done)=>{
        const mockFunction = jest.fn();

        let wrapper = mount(<RegisterForm registerFunction={mockFunction}/>);
        wrapper.find({'id': 'loginInput'}).getDOMNode()["value"] = "name";
        wrapper.find({'id': 'passwordInput'}).getDOMNode()["value"] = "password";
        wrapper.find({'id': "registerButton"}).simulate('click');

        expect(mockFunction.mock.calls.length).toEqual(1);
        expect(mockFunction.mock.calls[0][0]).toEqual("name");
        expect(mockFunction.mock.calls[0][1]).toEqual("password");
        done();
    });

    it('registerAccount when account created', (done)=> {
        let response = new AccountModel({
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
                expect(accountService.default.addOne.mock.calls[0][0]).toMatchObject(new AccountModel({"login": "user", "password": 'password'}));
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


    it('redirecting to /login if account cookie dont exist', (done)=>{
        const cookieService = require('../services/CookieService');
        cookieService.getCookie = jest.fn(()=> undefined );

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

        let wrapper = mount(
            <MemoryRouter>
                <HomePage/>
            </MemoryRouter>
                );
        let instance = wrapper.find(HomePage).instance();

        setTimeout(() => {
            expect(instance.state.events).toBe(events);
            done();
        }, 10);
    });

    it('eventList loadLists', (done)=>{
        let events = [new EventModel({"id": "id1", "name": "event1"}), new EventModel({"id": "id2", "name": "event2"})];
        let wrapper = mount(
            <MemoryRouter initialEntries={["/"]}>
                <Switch>
                    <EventList events={events}/>
                </Switch>
            </MemoryRouter>);

        expect(wrapper.find(OneEventView)).toHaveLength(2);
        done();
    });

    it('click EventView view was redirecting to event page ',async (done)=>{
        let event = new EventModel({"id": "some_id", "name": "event1", "reservables": []});

        const eventService = require("../services/EventService");
        eventService.default.getById = jest.fn(()=> Promise.resolve(event));

        let wrapper = mount(
            <MemoryRouter initialEntries={["/"]}>
                <Switch>
                    <Route path="/event/:id" component={EventPage} />
                    <Route path="/" component={()=><EventList events={[event]}/>} />
                </Switch>
            </MemoryRouter>
        );

        expect(wrapper.find(EventList)).toHaveLength(1);
        expect(wrapper.find(EventPage)).toHaveLength(0);
        let eventView = wrapper.find(OneEventView);
        let div = eventView.find('div');
        div.simulate('click');
        setTimeout(() => {
            let eventPageWrapper = wrapper.find(EventPage);
            expect(eventPageWrapper).toHaveLength(1);
            done();
        }, 1000);
    });
});

describe('eventPage', ()=>{
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

});

describe('reservables', ()=>{
    it('reservableView return SeatView', ()=>{
        let reservable = new SeatModel({"id": "id 1", "name": "seat1"});
        let wrapper = mount(<ReservableView reservable={reservable}/>);
        let reservableView = wrapper.find(SeatView);
        expect(reservableView.length).toBe(1);
    });

    it('reservableView return SpaceView', ()=>{
        let reservable = new SpaceModel({"id": "id 1", "name": "space1"});
        let wrapper = mount(<ReservableView reservable={reservable}/>);
        let reservableView = wrapper.find(SpaceView);
        expect(reservableView.length).toBe(1);
    });

    it('reservables generation test', (done)=>{
        let space = new SpaceModel({"id": "space1", "name": "space1", "reservables": [new SeatModel({"id": "seat1", "name": "seat1"})]});

        // @ts-ignore
        let wrapper = mount(<SpaceView spaceModel={space}/>);

        setTimeout(()=>{
            let reservableView = wrapper.find(SeatView);
            expect(reservableView).toHaveLength(1);
            done();
        }, 1000);
    });
});