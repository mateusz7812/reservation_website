import {configure, mount, shallow} from "enzyme";
import {MemoryRouter, Redirect} from "react-router-dom";
import App from "../App";
import LoginPage from "../components/LoginPage";
import LoginForm from "../components/LoginForm";
import HomePage from "../components/HomePage";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import AccountModel from "../dataModels/AccountModel";

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
    let wrapper = mount(<MemoryRouter><LoginPage/></MemoryRouter>);
    expect(wrapper.find(LoginForm)).toHaveLength(1);
});

it('loginForm call function', (done)=>{
    const mockFunction = jest.fn();

    let wrapper = mount(<MemoryRouter><LoginForm loginFunction={mockFunction}/></MemoryRouter>);
    wrapper.find({'id': 'loginInput'}).getDOMNode().setAttribute("value", "name");
    wrapper.find({'id': 'passwordInput'}).getDOMNode().setAttribute("value", "password");
    wrapper.find({'id': "loginButton"}).last().simulate('click');

    expect(mockFunction.mock.calls.length).toEqual(1);
    expect(mockFunction.mock.calls[0][0]).toEqual("name");
    expect(mockFunction.mock.calls[0][1]).toEqual("password");
    done();
});

it('loginAccount on 200 status', (done)=>{
    let isLogged = false;
    let tokenObject = {"token": "token", "account": "account id"};
    let accountObject = new AccountModel({"id": "account id", "login": "account1"});

    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>isLogged);
    cookieService.default.setToken = jest.fn();
    cookieService.default.setAccount = jest.fn(()=>{isLogged=true});

    const accountService = require("../services/AccountService");
    accountService.default.getTokenForAccount = jest.fn((account) => {
        expect(account.login).toEqual("user");
        expect(account.password).toEqual("password");
        return Promise.resolve(tokenObject);
    });
    accountService.default.getById = jest.fn(()=>Promise.resolve(accountObject));

    const homePage = require("../components/HomePage");
    homePage.default = jest.fn(() => {return(<div></div>)});

    const wrapper = mount(
        <MemoryRouter initialEntries={[ '/login']}>
            <App/>
        </MemoryRouter>);

    wrapper.update();

    expect(wrapper.find(LoginPage)).toHaveLength(1);
    wrapper.find({'id': 'loginInput'}).getDOMNode().setAttribute("value", "user");
    wrapper.find({'id': 'passwordInput'}).getDOMNode().setAttribute("value", "password");
    const reactWrapper = wrapper.find({'id': "loginButton"}).last();
    reactWrapper.simulate('click');

    setTimeout(
        () => {
            wrapper.update();
            expect(accountService.default.getTokenForAccount.mock.calls.length).toEqual(1);
            expect(accountService.default.getById).toHaveBeenCalledWith(accountObject["id"]);
            expect(cookieService.default.setToken).toHaveBeenCalledWith(tokenObject["token"]);
            expect(cookieService.default.setAccount).toHaveBeenCalledWith(accountObject);
            expect(wrapper.find(HomePage)).toHaveLength(1);
            done();
        }, 1000
    );
});

it('loginAccount on other than 200 status', (done)=> {
    let isLogged = false;
    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>isLogged);
    cookieService.default.setToken = jest.fn();
    cookieService.default.setAccount = jest.fn(()=>{isLogged=true});

    const accountService = require("../services/AccountService");
    accountService.default.getTokenForAccount = jest.fn(() => Promise.resolve(undefined));


    const wrapper = mount(
        <MemoryRouter initialEntries={[ '/login']}>
            <App/>
        </MemoryRouter>);

    wrapper.find({'id': 'loginInput'}).getDOMNode().setAttribute("value", "user");
    wrapper.find({'id': 'passwordInput'}).getDOMNode().setAttribute("value", "password");
    wrapper.find({'id': "loginButton"}).last().simulate('click');

    setTimeout(
        () => {
            wrapper.update();
            expect(wrapper.find({"id": "errorLabel"}).text()).toBe("error");
            expect(cookieService.default.setToken).toHaveBeenCalledTimes(0);
            done();
        }
    );
});

it('redirect to /home if cookie token exist', (done)=>{
    const cookieService = require('../services/CookieService');
    cookieService.default.isLogged = jest.fn(()=>true);

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