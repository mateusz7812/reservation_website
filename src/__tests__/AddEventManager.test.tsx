import {configure, mount} from "enzyme";
import AdminAddEventManager from "../components/adminPage/AdminAddEventManager";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import React from "react";
import AddEventForm from "../components/adminPage/AddEventForm";
import Adapter from "enzyme-adapter-react-16";
import {SeatModel} from "../dataModels/ReservableModel";
import SeatLabel from "../components/itemView/SeatLabel";
import EventModel from "../dataModels/EventModel";
import AddingEventPage from "../components/AddingEventPage";

configure({ adapter: new Adapter() });

it('event adding', (done)=>{
    let reservables = [new SeatModel({"id": "seat1", "name": "seat1"})];

    let reservableService = require("../services/ReservableService");
    reservableService.default.getAll = jest.fn(()=> Promise.resolve(reservables));

    let eventService = require("../services/EventService");
    eventService.default.addOne = jest.fn();

    let wrapper = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Switch>
                <Route path={"/adding/event"} component={AddingEventPage}/>
                <Route path={"/"} component={AdminAddEventManager}/>
            </Switch>
        </MemoryRouter>
    );

    const eventForm = wrapper.find(AddEventForm);
    expect(eventForm).toHaveLength(1);

    const nameInput = wrapper.find({"id": "nameInput"});
    // @ts-ignore
    nameInput.instance().value = 'eventName';

    const startDateInput = wrapper.find({"id": "startDateInput"});
    // @ts-ignore
    startDateInput.instance().value = '2016-07-19';
    const startTimeInput = wrapper.find({"id": "startTimeInput"});
    // @ts-ignore
    startTimeInput.instance().value = '20:23:01';

    const endDateInput = wrapper.find({"id": "endDateInput"});
    // @ts-ignore
    endDateInput.instance().value = '2016-07-20';
    const endTimeInput = wrapper.find({"id": "endTimeInput"});
    // @ts-ignore
    endTimeInput.instance().value = '15:43:54';

    const saveButton = wrapper.find({"id": "saveButton"});
    saveButton.simulate('click');

    setTimeout(()=>{
        wrapper.update();

        const seatLabel = wrapper.find(SeatLabel);
        seatLabel.simulate('click');

        setTimeout(()=>{
            wrapper.update();
            const addButton = wrapper.find({"id": "addButton"});
            addButton.simulate('click');

            setTimeout(()=>{
                wrapper.update();
                let expectedEvent = new EventModel({"name": "eventName", "reservable": "seat1",
                    "startDate": new Date("2016-07-19T20:23:01Z").getTime()/1000,
                    "endDate": new Date("2016-07-20T15:43:54Z").getTime()/1000});
                expect(eventService.default.addOne).toHaveBeenCalledWith(expectedEvent);
                done();
            }, 2000);
        }, 1000);
    }, 1000);

});