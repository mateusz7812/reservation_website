import AdminAddAccountManager from "../components/adminPage/AdminAddAccountManager";
import {configure, mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import AddAccountForm from "../components/AddAccountForm";
import AccountModel from "../dataModels/AccountModel";
import UserAddAccountManager from "../components/UserAddAccountManager";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import AddingAccountPage from "../components/AddingAccountPage";

configure({ adapter: new Adapter() });

it('add account',()=>{
    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path={"/adding/account"} component={AddingAccountPage}/>
                <Route path="/" component={AdminAddAccountManager}/>
            </Switch>
        </MemoryRouter>
    );

    let accountService = require("../services/AccountService");
    accountService.default.addOne = jest.fn();

    const accountForm = wrapper.find(AddAccountForm);
    expect(accountForm).toHaveLength(1);

    const loginInput = accountForm.find({"id": "loginInput"});
    loginInput.simulate('change', { target: { value: 'login1' } });

    const passwordInput = accountForm.find({"id": "passwordInput"});
    passwordInput.simulate('change', { target: { value: 'password1' } });

    const roleInput = accountForm.find({"id": "roleInput"});
    const reactWrapper = roleInput.find('option');
    // @ts-ignore
    reactWrapper.instance().selected = true;

    const addButton = accountForm.find({"id": "addButton"});
    addButton.last().simulate('click');

    setTimeout(()=>{
        wrapper.update();
        expect(accountService.default.addOne.mock.calls[0][0]).toMatchObject(new AccountModel({"login": "login1", "password": "password1", "roles": ["ROLE_ADMIN"]}))
    }, 1000);
});

it('user add manager render', ()=>{
    let wrapper = mount(<UserAddAccountManager/>);
    expect(wrapper.find("select")).toHaveLength(0);
});

