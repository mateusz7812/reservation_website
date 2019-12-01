import React from 'react';
import App from '../App';
import {configure, mount, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import LoginPage from "../LoginPage";
import {MemoryRouter, Redirect} from "react-router-dom";
import HomePage from "../HomePage";
import RegisterForm from "../RegisterForm";
import RegisterPage from "../RegisterPage";

configure({ adapter: new Adapter() });

it('loginPage at /login', ()=>{
  let wrapper = mount(
      <MemoryRouter initialEntries={[ '/login']}>
        <App/>
      </MemoryRouter>
  );
  expect(wrapper.find(LoginPage)).toHaveLength(1);
  wrapper.find({'id': 'loginInput'}).simulate('change', {target: {value: 'name'}});
});

it('registerPage at /register', () => {
    let wrapper = mount(
        <MemoryRouter initialEntries={[ '/register']}>
            <App/>
        </MemoryRouter>
    );
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
  expect(wrapper.find(HomePage)).toHaveLength(1);
});



/*
it('redirecting to /login if account cookie dont exist', ()=>{
  let wrapper = mount(
      <MemoryRouter initialEntries={[ '/']}>
        <App/>
      </MemoryRouter>
  );

  expect(wrapper.containsMatchingElement(<Redirect to="/login" />)).toEqual(true)
});
*/

/*it('redirect to /home if cookie account exist', ()=>{

  const wrapper = mount(
      <MemoryRouter initialEntries={[ '/login' ]}>
        <App/>
      </MemoryRouter>
  );

  Cookies.get = jest.fn()
      .mockImplementationOnce(() => 'en');

  expect(wrapper.containsMatchingElement(<Redirect to="/" />)).toEqual(true)

});
*/

