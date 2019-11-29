import React from 'react';
import App from '../App';
import {configure, mount, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import LoginPage from "../LoginPage";
import {MemoryRouter} from "react-router-dom";
import HomePage from "../HomePage";
import RegisterPage from "../../RegisterPage";
import axios from 'axios';

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
    expect(wrapper.find(RegisterPage)).toHaveLength(1);
});

it('register api call', ()=>{
    let wrapper = mount(<RegisterPage/>);
    wrapper.find({'id': 'loginInput'}).simulate('change', {target: {value: 'name'}});
    wrapper.find({'id': 'passwordInput'}).simulate('change', {target: {value: 'password'}});

    let mock = jest.mock('axios');
    axios.post.mockResolvedValue({body: "true"});
    expect(wrapper.findWhere({})).toBe(1);
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

