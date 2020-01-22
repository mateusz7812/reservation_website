import {configure, mount} from "enzyme";
import AdminAddReservableManager from "../components/adminPage/AdminAddReservableManager";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import AddReservableForm from "../components/adminPage/AddReservableForm";
import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservableList from "../components/ReservableList";
import SpaceLabel from "../components/itemView/SpaceLabel";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import AddingReservablePage from "../components/AddingReservablePage";

configure({ adapter: new Adapter() });

it('add seat', (done)=>{
    const reservables = [new SeatModel({"id": "seat1", "name": "seat1"}), new SpaceModel({"id": "space1", "name": "space1"})];

    const reservableService = require("../services/ReservableService");
    reservableService.default.addOne = jest.fn();
    reservableService.default.getAll = jest.fn(()=>Promise.resolve(reservables));

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path={"/adding/reservable"} component={AddingReservablePage}/>
                <Route path={"/"} component={AdminAddReservableManager}/>
            </Switch>
        </MemoryRouter>);


    const form = wrapper.find(AddReservableForm);
    expect(form).toHaveLength(1);

    const typeInput = form.find('select');
    const reactWrapper = typeInput.find('option').at(1);
    // @ts-ignore
    reactWrapper.instance().selected = true;

    const nameInput = form.find({"id": "nameInput"});
    // @ts-ignore
    nameInput.last().instance().value = "reservableName";

    const saveButton = form.find({"id": "saveButton"});
    saveButton.last().simulate('click');

    setTimeout(()=>{
        wrapper.update();

        let reservablesList = wrapper.find(ReservableList);
        expect(reservablesList).toHaveLength(1);

        const seatLabel = reservablesList.find(SpaceLabel);
        seatLabel.simulate('click');

        setTimeout(()=>{
            wrapper.update();

            const addButton = wrapper.find({"id": "addButton"});
            addButton.last().simulate('click');

            setTimeout(()=>{
                expect(reservableService.default.addOne.mock.calls[0][0]).toMatchObject(new SeatModel({"name": "reservableName", "space": "space1"}));
                done();
            }, 1000);
        }, 1000);
    }, 1000);
});