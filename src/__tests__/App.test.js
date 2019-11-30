import React from 'react';
import App from '../App';
import {configure, mount} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import LoginPage from "../LoginPage";
import {MemoryRouter} from "react-router-dom";
import HomePage from "../HomePage";
import RegisterForm from "../../RegisterForm";

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

