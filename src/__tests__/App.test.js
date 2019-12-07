import React from 'react';
import App from '../App';
import {configure, mount, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import LoginPage from "../LoginPage";
import {MemoryRouter, Redirect, Switch} from "react-router-dom";
import HomePage from "../HomePage";
import RegisterForm from "../RegisterForm";
import RegisterPage from "../RegisterPage";
import LoginForm from "../LoginForm";
import PrivateRoute from "../PrivateRoute";

configure({ adapter: new Adapter() });

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

it('login form', ()=>{
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
    let response = {"status": 200, "data": {
        "id":"f385e685-2933-4207-b945-a1198b4154c5",
            "token":"BZ3BL34T3FrSJJP0Pmm7O",
            "account":"decf9766-f9ac-4ff5-a21e-36deb31b4104"
    }};

    const cookieService = require('../CookieService.js');
    cookieService.addCookie = jest.fn((key, value)=>{
        expect(key).toBe("token");
        expect(value).toBe("BZ3BL34T3FrSJJP0Pmm7O");
    });

    const apiMethods = require('../ApiService.js');
    apiMethods.login = jest.fn((user, password) => {
        expect(user).toEqual("user");
        expect(password).toEqual("password");
        return Promise.resolve(response);
    });

    shallow(<LoginPage />).instance().loginAccount("user", "password").then(
        r => {
            expect(apiMethods.login.mock.calls.length).toEqual(1);
            expect(cookieService.addCookie.mock.calls.length).toEqual(1);
            expect(r).toMatchObject(<Redirect to='/home'/>);
            done();
        }
    );
});

it('loginAccount on other than 200 status', (done)=> {
    let response = {"status": 400};

    const cookieService = require('../CookieService.js');
    cookieService.addCookie = jest.fn();

    const apiMethods = require('../ApiService.js');
    apiMethods.login = jest.fn(() => Promise.resolve(response));

    let instance = shallow(<LoginPage />).instance();

    instance.loginAccount("user", "password").then(
        () => {
            expect(instance.state.message).toBe("error");
            expect(cookieService.addCookie.mock.calls.length).toEqual(0);
            done();
        }
    );
});

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

it('register form', ()=>{
    const mockFunction = jest.fn();

    let wrapper = mount(<RegisterForm registerFunction={mockFunction}/>);
    wrapper.find({'id': 'loginInput'}).getDOMNode()["value"] = "name";
    wrapper.find({'id': 'passwordInput'}).getDOMNode()["value"] = "password";
    wrapper.find({'id': "registerButton"}).simulate('click');

    expect(mockFunction.mock.calls.length).toEqual(1);
    expect(mockFunction.mock.calls[0][0]).toEqual("name");
    expect(mockFunction.mock.calls[0][1]).toEqual("password");
});

it('registerAccount on 200 status', (done)=> {
    let response = {"status": 200, "data": {
            "id": "49241151-fb8c-4cb3-a551-85408cb4fe66",
            "reservations": [],
            "login": "user",
            "password": "password"
        }};

    const apiMethods = require('../ApiService.js');
    apiMethods.register = jest.fn(() => Promise.resolve(response));

    shallow(<RegisterPage />).instance().registerAccount("user", "password").then(
        r => {
            expect(apiMethods.register.mock.calls.length).toEqual(1);
            expect(apiMethods.register.mock.calls[0][0]).toEqual("user");
            expect(apiMethods.register.mock.calls[0][1]).toEqual("password");
            expect(r).toMatchObject(<Redirect to='/login'/>);
            done();
        }
    );
});

it('registerAccount on other than 200 status', (done)=> {
    let response = {"status": 400};

    const apiMethods = require('../ApiService.js');
    apiMethods.register = jest.fn(() => Promise.resolve(response));

    let instance = shallow(<RegisterPage />).instance();
    instance.registerAccount("user", "password").then(
        () => {
            expect(instance.state.message).toBe("error");
            done();
        }
    );
});

it('homePage at /', ()=>{
  let wrapper = mount(
      <MemoryRouter initialEntries={[ '/']}>
        <App/>
      </MemoryRouter>
  );

    const cookieService = require('../CookieService.js');
    cookieService.getCookie = jest.fn((value)=>{
        if(value === "token"){
            return "BZ3BL34T3FrSJJP0Pmm7O";
        }
        else if(value === "account"){
            return {
                "id": "49241151-fb8c-4cb3-a551-85408cb4fe66",
                "reservations": [],
                "login": "user",
                "password": "password"
            };
        }
    });

  expect(wrapper.find(HomePage)).toHaveLength(1);
});


it('redirecting to /login if account cookie dont exist', ()=>{
    const cookieService = require('../CookieService.js');
    cookieService.getCookie = jest.fn(()=> undefined );

    let wrapper = mount(
      <MemoryRouter initialEntries={[ '/']}>
        <App/>
      </MemoryRouter>
    );
    expect(wrapper.find(HomePage)).toHaveLength(0);
    expect(wrapper.find(LoginPage)).toHaveLength(1);
});


it('redirect to /home if cookie account exist', ()=>{
    const cookieService = require('../CookieService.js');
    cookieService.getCookie = jest.fn(()=>  "BZ3BL34T3FrSJJP0Pmm7O" );

    let wrapper = mount(
        <MemoryRouter initialEntries={[ '/login']}>
            <App/>
        </MemoryRouter>
    );
    expect(wrapper.find(HomePage)).toHaveLength(1);
    expect(wrapper.find(LoginPage)).toHaveLength(0);

});
