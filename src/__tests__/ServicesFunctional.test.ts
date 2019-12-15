import AccountService from "../services/AccountService";
import Account from "../dataModels/Account";
import ReservableService from "../services/ReservableService";
import {Seat, Space} from "../dataModels/Reservable";
import EventService from "../services/EventService";
import Event from "../dataModels/Event";
import ReservationService from "../services/ReservationService";
import Reservation from "../dataModels/Reservation";

function setToken(token: string){
    let cookieService = require("../services/CookieService");
    cookieService.getToken = jest.fn(()=>token);
}

it('functional test', async () => {
    jest.setTimeout(30000);
    let adminAccount = new Account({"login":"admin", "password": "admin"});
    let adminToken = await AccountService.getTokenForAccount(adminAccount as Account);

    setToken(adminToken as string);

    let user1Accounts = await AccountService.getFiltered(new Account({"login": "user1"}));
    // @ts-ignore
    if(user1Accounts.length === 1){
        // @ts-ignore
        await AccountService.deleteById(user1Accounts[0].id);
    }
    let user1 = await AccountService.addOne(new Account({"login": "user1", "password": "password"})) as Account;
    user1.password = "password";
    let user1Token = await AccountService.getTokenForAccount(user1);

    let user2Accounts = await AccountService.getFiltered(new Account({"login": "user2"}));
    // @ts-ignore
    if(user2Accounts.length === 1){
        // @ts-ignore
        await AccountService.deleteById(user2Accounts[0].id);
    }
    let user2 = await AccountService.addOne(new Account({"login": "user2", "password": "password"})) as Account;
    user2.password = "password";
    let user2Token = await AccountService.getTokenForAccount(user2);

    user1.login = "login";
    await AccountService.editById(user1);

    user2.password = "other";
    await AccountService.editById(user2);

    let space1: Space = await ReservableService.addOne(new Space({"name": "space1"})) as Space;
    let space2: Space = await ReservableService.addOne(new Space({"name": "space2"})) as Space;
    let space3: Space = await ReservableService.addOne(new Space({"name": "space3", "space": space1})) as Space;
    let space4: Space = await ReservableService.addOne(new Space({"name": "space4", "space": space1})) as Space;

    let seat1: Seat = await ReservableService.addOne(new Seat({"name": "seat1", "space": space1})) as Seat;
    let seat2: Seat = await ReservableService.addOne(new Seat({"name": "seat2", "space": space2})) as Seat;
    let seat3: Seat = await ReservableService.addOne(new Seat({"name": "seat3", "space": space2})) as Seat;
    let seat4: Seat = await ReservableService.addOne(new Seat({"name": "seat4", "space": space3})) as Seat;
    let seat5: Seat = await ReservableService.addOne(new Seat({"name": "seat5", "space": space3})) as Seat;
    let seat6: Seat = await ReservableService.addOne(new Seat({"name": "seat6", "space": space3})) as Seat;
    let seat7: Seat = await ReservableService.addOne(new Seat({"name": "seat7", "space": space3})) as Seat;
    let seat8: Seat = await ReservableService.addOne(new Seat({"name": "seat8", "space": space4})) as Seat;
    let seat9: Seat = await ReservableService.addOne(new Seat({"name": "seat9", "space": space4})) as Seat;

    let event1: Event = await EventService.addOne(new Event({"reservable": space1, "name": "event1", "startDate": 1200, "endDate": 1400})) as Event;
    let event2: Event = await EventService.addOne(new Event({"reservable": space2, "name": "event2", "startDate": 1300, "endDate": 1400})) as Event;
    let event3: Event = await EventService.addOne(new Event({"reservable": space4, "name": "event3", "startDate": 1500, "endDate": 1800})) as Event;

    setToken(user1Token as string);

    let reservation1: Reservation = await ReservationService.addOne(new Reservation({"account": user1.id, "event": event3.id, "reservable":seat8})) as Reservation;
    let reservation2: Reservation = await ReservationService.addOne(new Reservation({"account": user1.id, "event": event1.id, "reservable":seat5})) as Reservation;

    setToken(user2Token as string);

    let reservation3: Reservation = await ReservationService.addOne(new Reservation({"account": user2.id, "event": event1.id, "reservable":seat8})) as Reservation;
    let reservation4: Reservation = await ReservationService.addOne(new Reservation({"account": user2.id, "event": event2.id, "reservable":space2})) as Reservation;

    // @ts-ignore
    await ReservationService.getById(reservation3.id as string).then((response)=>{
        // @ts-ignore
        expect(response.account).toBe((user2 as Account).id);
    });

    expect( await ReservationService.deleteById(reservation3.id as string)).toBeTruthy();

    setToken(user1Token as string);

    reservation1.reservable = seat9;
    reservation1 = await ReservationService.updateOne(reservation1) as Reservation;

    await ReservationService.deleteById(reservation1.id as string);
    await ReservationService.deleteById(reservation2.id as string);

    setToken(user2Token as string);

    await ReservationService.deleteById(reservation4.id as string);

    setToken(adminToken as string);

    event1.reservable = space3;
    await EventService.updateOne(event1);

    await EventService.deleteById(event1.id as string);
    await EventService.deleteById(event2.id as string);
    await EventService.deleteById(event3.id as string);

    await ReservableService.deleteById(seat1.id as string);
    await ReservableService.deleteById(seat2.id as string);
    await ReservableService.deleteById(seat3.id as string);
    await ReservableService.deleteById(seat4.id as string);
    await ReservableService.deleteById(seat5.id as string);
    await ReservableService.deleteById(seat6.id as string);
    await ReservableService.deleteById(seat7.id as string);
    await ReservableService.deleteById(seat8.id as string);
    await ReservableService.deleteById(seat9.id as string);
    await ReservableService.deleteById(space2.id as string);
    await ReservableService.deleteById(space3.id as string);
    await ReservableService.deleteById(space4.id as string);
    await ReservableService.deleteById(space1.id as string);


    await AccountService.deleteById(user1.id as string);
    await AccountService.deleteById(user2.id as string);

    expect(await ReservableService.getById(seat3.id as string) === undefined).toBeTruthy();
    expect(await ReservableService.getById(space1.id as string) === undefined).toBeTruthy();
    expect(await EventService.getById(event2.id as string) === undefined).toBeTruthy();
    expect(await AccountService.getById(user2.id as string) === undefined).toBeTruthy();

});