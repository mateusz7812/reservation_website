import {configure, mount, shallow} from "enzyme";
import {MemoryRouter, Redirect} from "react-router-dom";
import App from "../App";
import RegisterPage from "../components/RegisterPage";
import RegisterForm from "../components/RegisterForm";
import AccountModel from "../dataModels/AccountModel";
import React from "react";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

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
    wrapper.find({'id': 'loginInput'}).getDOMNode().setAttribute("value", "name");
    wrapper.find({'id': 'passwordInput'}).getDOMNode().setAttribute("value", "password");
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

    (shallow(<RegisterPage />).instance() as RegisterPage).registerAccount("user", "password").then(
        r => {
            expect(accountService.default.addOne.mock.calls.length).toEqual(1);
            expect(accountService.default.addOne.mock.calls[0][0]).toMatchObject(new AccountModel({"login": "user", "password": 'password'}));
            expect(r).toMatchObject(<Redirect to='/login'/>);
            done();
        }
    );
});

it('registerAccount when account not created', (done)=> {
    const accountService = require("../services/AccountService");
    accountService.default.addOne = jest.fn(() => Promise.resolve(undefined));

    let instance = shallow(<RegisterPage />).instance() as RegisterPage;
    instance.registerAccount("user", "password").then(
        () => {
            expect(instance.state.message).toBe("error");
            done();
        }
    );
});
