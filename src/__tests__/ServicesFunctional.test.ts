import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import ReservableService from "../services/ReservableService";
import {SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";
import ReservationService from "../services/ReservationService";
import ReservationModel from "../dataModels/ReservationModel";

function setToken(token: string){
    let cookieService = require("../services/CookieService");
    cookieService.getToken = jest.fn(()=>token);
}

it('functional test', async () => {
    jest.setTimeout(30000);
    let adminAccount = new AccountModel({"login":"admin", "password": "admin"});
    let adminToken = await AccountService.getTokenForAccount(adminAccount as AccountModel);

    setToken(adminToken as string);

    let user1Accounts = await AccountService.getFiltered(new AccountModel({"login": "user1"}));
    // @ts-ignore
    if(user1Accounts.length === 1){
        // @ts-ignore
        await AccountService.deleteById(user1Accounts[0].id);
    }
    let user1 = await AccountService.addOne(new AccountModel({"login": "user1", "password": "password"})) as AccountModel;
    user1.password = "password";
    let user1Token = await AccountService.getTokenForAccount(user1);

    let user2Accounts = await AccountService.getFiltered(new AccountModel({"login": "user2"}));
    // @ts-ignore
    if(user2Accounts.length === 1){
        // @ts-ignore
        await AccountService.deleteById(user2Accounts[0].id);
    }
    let user2 = await AccountService.addOne(new AccountModel({"login": "user2", "password": "password"})) as AccountModel;
    user2.password = "password";
    let user2Token = await AccountService.getTokenForAccount(user2);

    user1.login = "login";
    await AccountService.editById(user1);

    user2.password = "other";
    await AccountService.editById(user2);

    let space1: SpaceModel = await ReservableService.addOne(new SpaceModel({"name": "space1"})) as SpaceModel;
    let space2: SpaceModel = await ReservableService.addOne(new SpaceModel({"name": "space2"})) as SpaceModel;
    let space3: SpaceModel = await ReservableService.addOne(new SpaceModel({"name": "space3", "space": space1})) as SpaceModel;
    let space4: SpaceModel = await ReservableService.addOne(new SpaceModel({"name": "space4", "space": space1})) as SpaceModel;

    let seat1: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat1", "space": space1})) as SeatModel;
    let seat2: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat2", "space": space2})) as SeatModel;
    let seat3: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat3", "space": space2})) as SeatModel;
    let seat4: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat4", "space": space3})) as SeatModel;
    let seat5: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat5", "space": space3})) as SeatModel;
    let seat6: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat6", "space": space3})) as SeatModel;
    let seat7: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat7", "space": space3})) as SeatModel;
    let seat8: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat8", "space": space4})) as SeatModel;
    let seat9: SeatModel = await ReservableService.addOne(new SeatModel({"name": "seat9", "space": space4})) as SeatModel;

    let event1: EventModel = await EventService.addOne(new EventModel({"reservable": space1, "name": "event1", "startDate": 1200, "endDate": 1400})) as EventModel;
    let event2: EventModel = await EventService.addOne(new EventModel({"reservable": space2, "name": "event2", "startDate": 1300, "endDate": 1400})) as EventModel;
    let event3: EventModel = await EventService.addOne(new EventModel({"reservable": space4, "name": "event3", "startDate": 1500, "endDate": 1800})) as EventModel;

    setToken(user1Token as string);

    let reservation1: ReservationModel = await ReservationService.addOne(new ReservationModel({"account": user1.id, "event": event3.id, "reservable":seat8})) as ReservationModel;
    let reservation2: ReservationModel = await ReservationService.addOne(new ReservationModel({"account": user1.id, "event": event1.id, "reservable":seat5})) as ReservationModel;

    setToken(user2Token as string);

    let reservation3: ReservationModel = await ReservationService.addOne(new ReservationModel({"account": user2.id, "event": event1.id, "reservable":seat8})) as ReservationModel;
    let reservation4: ReservationModel = await ReservationService.addOne(new ReservationModel({"account": user2.id, "event": event2.id, "reservable":space2})) as ReservationModel;

    // @ts-ignore
    await ReservationService.getById(reservation3.id as string).then((response)=>{
        // @ts-ignore
        expect(response.account).toBe((user2 as AccountModel).id);
    });

    expect( await ReservationService.deleteById(reservation3.id as string)).toBeTruthy();

    setToken(user1Token as string);

    reservation1.reservable = seat9;
    reservation1 = await ReservationService.updateOne(reservation1) as ReservationModel;

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