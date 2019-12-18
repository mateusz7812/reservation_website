import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservableView from "../components/ReservableView";
import SeatView from "../components/SeatView";
import SpaceView from "../components/SpaceView";

configure({ adapter: new Adapter() });

describe('reservables', ()=>{
    it('reservableView return SeatView', ()=>{
        let reservable = new SeatModel({"id": "id 1", "name": "seat1"});
        let wrapper = mount(<ReservableView
            // @ts-ignore
            reservable={reservable}/>);
        let reservableView = wrapper.find(SeatView);
        expect(reservableView.length).toBe(1);
    });

    it('reservableView return SpaceView', ()=>{
        let reservable = new SpaceModel({"id": "id 1", "name": "space1"});
        let wrapper = mount(<ReservableView
            // @ts-ignore
            reservable={reservable}/>);
        let reservableView = wrapper.find(SpaceView);
        expect(reservableView.length).toBe(1);
    });

});