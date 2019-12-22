import EventModel from "../dataModels/EventModel";
import {SeatModel} from "../dataModels/ReservableModel";
import {configure, mount, ReactWrapper} from "enzyme";
import EventPage from "../components/EventPage";
import React from "react";
import ReservationManager from "../components/ReservationManager";
import ReservableService from "../services/ReservableService";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

it('reservables added to selected reservables list after click and removed after next', (done)=>{
    let seat = new SeatModel({"id": "seat1", "name": "seat1"});
    // @ts-ignore

    const reservableService = require("../services/ReservableService");
    reservableService.default.getById = jest.fn(()=> Promise.resolve(seat));

    let wrapper = mount(
        <ReservationManager
            // @ts-ignore
            reservablePromise={ReservableService.getById("seat1")} />);

    setTimeout(()=> {
        wrapper.update();
        const seatsViews: ReactWrapper<any, any> = wrapper.find({"className": "seatView"});
        expect(seatsViews).toHaveLength(1);
        let seatView = seatsViews.first();
        seatView.simulate('click');

        wrapper.update();
        const selectedReservablesList: ReactWrapper<any, any> = wrapper.find({"id": "selectedReservablesList"});
        expect(selectedReservablesList).toHaveLength(1);
        let selectedSeats = selectedReservablesList.find({"className": "seatView"});
        expect(selectedSeats).toHaveLength(1);
        selectedSeats.first().simulate('click');

        wrapper.update();
        const selectedReservablesList2: ReactWrapper<any, any> = wrapper.find({"id": "selectedReservablesList"});
        expect(selectedReservablesList2).toHaveLength(1);
        let selectedSeats2 = selectedReservablesList2.find({"className": "seatView"});
        expect(selectedSeats2).toHaveLength(0);
        done();
    }, 10);
});

