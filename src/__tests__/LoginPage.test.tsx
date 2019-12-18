import {configure, mount, shallow} from "enzyme";
import {MemoryRouter, Redirect} from "react-router-dom";
import App from "../App";
import LoginPage from "../components/LoginPage";
import LoginForm from "../components/LoginForm";
import HomePage from "../components/HomePage";
import React from "react";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

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
    wrapper.find({'id': 'loginInput'}).getDOMNode().setAttribute("value", "name");
    wrapper.find({'id': 'passwordInput'}).getDOMNode().setAttribute("value", "password");
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

    (shallow(<LoginPage />).instance()as LoginPage).loginAccount("user", "password").then(
        r => {
            expect(accountService.default.getTokenForAccount.mock.calls.length).toEqual(1);
            expect(cookieService.addCookie.mock.calls.length).toEqual(1);
            expect(r).toMatchObject(<Redirect to='/home'/>);
            done();
        }
    );
});

it('loginAccount on other than 200 status', (done)=> {
    const cookieService = require('../services/CookieService');
    cookieService.addCookie = jest.fn();

    const accountService = require("../services/AccountService");
    accountService.default.getTokenForAccount = jest.fn(() => Promise.resolve(undefined));

    let instance = shallow(<LoginPage />).instance() as LoginPage;

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