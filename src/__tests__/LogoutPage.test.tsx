import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import {MemoryRouter} from "react-router-dom";
import App from "../App";
import LogoutPage from "../components/LogoutPage";

configure({ adapter: new Adapter() });

it('logoutPage at /logout', (done)=> {

    let cookieService = require("../services/CookieService");
    cookieService.default.isLogged = jest.fn(()=> true);
    cookieService.default.logOut = jest.fn();

    let wrapper = mount(
        <MemoryRouter initialEntries={["/logout"]}>
            <App/>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(wrapper.find(LogoutPage)).toHaveLength(1);
        expect(cookieService.default.logOut).toHaveBeenCalled();
        done();
    }, 100);
});
