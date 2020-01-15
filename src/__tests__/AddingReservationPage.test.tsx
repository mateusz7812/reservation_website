import {configure, mount} from "enzyme";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {SeatModel} from "../dataModels/ReservableModel";
import ReservationModel from "../dataModels/ReservationModel";
import AddingReservationPage from "../components/AddingReservationPage";

configure({ adapter: new Adapter() });

it('redirect when no reservations was sent', (done)=>{

    let reservationService = require("../services/ReservationService");
    reservationService.default.addOne = jest.fn();

    const homePage = ()=><div>homePage</div>;
    const reservingPage = (props: any) =>
        <AddingReservationPage
            {...props}
            // @ts-ignore
            location={{state: {}}}/>;

    let wrapper = mount(
        <MemoryRouter initialEntries={["/reserving"]}>
            <Switch>
                <Route path={"/reserving"} component={reservingPage} />
                <Route path={"/"} component={homePage}/>
            </Switch>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(reservationService.default.addOne).toHaveBeenCalledTimes(0);
        expect(wrapper.find(reservingPage)).toHaveLength(0);
        expect(wrapper.find(homePage)).toHaveLength(1);
        done();
    }, 10);

});

it('redirect when all reservations added', (done)=>{
    let allReservables = {"reservable1": new SeatModel({"id": "seat1"})};
    const reservationBeforeAdd = new ReservationModel({"account": "account1", "event": "event1", "reservable": allReservables["reservable1"].id});
    let reservationsToAdd = [reservationBeforeAdd];
    const reservationAfterAdd = new ReservationModel({"id": "","account": "account1", "event": "event1", "reservable": allReservables["reservable1"].id});

    let reservationService = require("../services/ReservationService");
    reservationService.default.addOne = jest.fn(()=>Promise.resolve(reservationAfterAdd));

    const reservingPage = (props: any) =>
        <AddingReservationPage
            {...props}
            // @ts-ignore
            location={{state: {allReservables: allReservables, reservationsToAdd: reservationsToAdd, redirectPath: "/custom"}}}
        />;
    const homePage = ()=><div>homePage</div>;

    let wrapper = mount(
        <MemoryRouter initialEntries={["/reserving"]}>
            <Switch>
                <Route path={"/reserving"} component={reservingPage}/>
                <Route path={"/custom"} component={homePage}/>
            </Switch>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(reservationService.default.addOne).toHaveBeenCalled();
        expect(wrapper.find(homePage)).toHaveLength(1);
        done();
    },  3000);

});

it('show button if any request was rejected', (done)=>{

    let allReservables = {"reservable1": new SeatModel({"id": "seat1"})};
    const reservationBeforeAdd = new ReservationModel({"account": "account1", "event": "event1", "reservable": allReservables["reservable1"].id});
    let reservationsToAdd = [reservationBeforeAdd];

    let reservationService = require("../services/ReservationService");
    reservationService.default.addOne = jest.fn(()=>Promise.reject({response:{data:{message: "error happened"}}}));

    const reservingPage = (props: any) =>
        <AddingReservationPage
            {...props}
            // @ts-ignore
            location={{state: {allReservables: allReservables, reservationsToAdd: reservationsToAdd, redirectPath: "/custom"}}}
        />;
    const homePage = ()=><div>homePage</div>;

    let wrapper = mount(
        <MemoryRouter initialEntries={["/reserving"]}>
            <Switch>
                <Route path={"/reserving"} component={reservingPage}/>
                <Route path={"/custom"} component={homePage}/>
            </Switch>
        </MemoryRouter>
    );

    setTimeout(()=>{
        wrapper.update();
        expect(reservationService.default.addOne).toHaveBeenCalled();
        expect(wrapper.find(homePage)).toHaveLength(0);
        expect(wrapper.find({"id":"backButton"})).toHaveLength(1);
        done();
    },  3000);
});