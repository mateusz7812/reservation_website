import moxios from "moxios";
import {
    addEvent,
    addReservable,
    addReservation,
    deleteReservationById,
    getAccountById,
    getReservationById,
    getTokenFromApi,
    addAccount,
    updateReservation,
    getAccountFiltered,
    deleteAccountById,
    getReservableById,
    deleteReservableById,
    getEventById, deleteEventById, updateEvent, getAllEvents
} from "../domain/ApiRequests";
import AccountModel from "../dataModels/AccountModel";
import {AxiosResponse} from "axios";
import EventModel from "../dataModels/EventModel";
import {ReservableModel, SeatModel, SpaceModel} from "../dataModels/ReservableModel";
import ReservationModel from "../dataModels/ReservationModel";

describe('basic tests', ()=>{
    beforeEach(function () {
        moxios.install()
    });

    afterEach(function () {
        moxios.uninstall();
        setTimeout(()=>{}, 500);
    });

    describe('account tests', ()=>{
        it('api addAccount user', async (done)=>{

            let requestAccount = new AccountModel({"login": "user", "password": "password"});
            let responseAccount: AccountModel = new AccountModel({"id": "f385e685-2933-4207-b945-a1198b4154c5", "login": "user"});

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();

                expect(request.config.method).toBe("post");
                expect(request.url).toContain("/api/account");

                expect(new AccountModel(JSON.parse(request.config.data))).toMatchObject(requestAccount);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseAccount)
                }).finally(done())
            });

            await addAccount(requestAccount).then((response: AxiosResponse)=>{
                expect(new AccountModel(response.data)).toMatchObject(responseAccount);
                done();
            });

        });

        it('get token from api',  async (done)=>{

            let requestAccount = new AccountModel({"login": "user","password": "password"});
            let tokenResponse = {"id":"f385e685-2933-4207-b945-a1198b4154c5","token":"BZ3BL34T3FrSJJP0Pmm7O","account":"decf9766-f9ac-4ff5-a21e-36deb31b4104"};

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/authenticate");

                let auth = request.config.auth;
                expect((auth as any).username).toBe(requestAccount.login);
                expect((auth as any).password).toBe(requestAccount.password);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(tokenResponse)
                }).finally(done())
            });

            await getTokenFromApi(requestAccount).then((response: AxiosResponse)=>{
                expect(response.data).toMatchObject(tokenResponse);
            });

        });

        it('get account by id', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let responseAccount = new AccountModel({"id": "decf9766-f9ac-4ff5-a21e-36deb31b4104", "login": "user", "reservations": [], "roles": []});

            moxios.wait(()=>{
                let requests = moxios.requests;
                let request = requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/account/"+id);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseAccount)
                }).finally(done());
            });

            await getAccountById(id, token).then((response:AxiosResponse)=>{
                expect(new AccountModel(response.data)).toMatchObject(responseAccount);
            });

        });


        it('get account filtered by login', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let accountFilter = new AccountModel({"login": "user"});
            let responseAccount = new AccountModel({"id": id,"login": "user", "reservations":  [], "roles": []});

            moxios.wait(()=>{
                let requests = moxios.requests;
                let request = requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/account?login="+responseAccount.login);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseAccount)
                }).finally(done());
            });

            await getAccountFiltered(accountFilter, token).then((response:AxiosResponse)=>{
                expect(new AccountModel(response.data)).toMatchObject(responseAccount);
            });

        });

        it('get all accounts', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let accountFilter = new AccountModel({"login": "user"});
            let responseAccount = new AccountModel({"id": id,"login": "user", "reservations":  [], "roles": []});

            moxios.wait(()=>{
                let requests = moxios.requests;
                let request = requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/account");

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseAccount)
                }).finally(done());
            });

            await getAccountFiltered(accountFilter, token).then((response:AxiosResponse)=>{
                expect(new AccountModel(response.data)).toMatchObject(responseAccount);
            });

        });

        it('delete account', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("delete");
                expect(request.url).toContain("/api/account/"+id);

                request.respondWith({
                    status: 200
                }).finally(done());
            });

            await deleteAccountById(id, token);

        });
    });

    describe('event tests', ()=>{
        it('add event', async (done)=> {
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let name: string = "eventName";
            let reservable = ReservableModel.new({type: "Seat", id: "decf9766-f9ac-4ff5-a21e-36deb31b4104", reservations:[]});
            let responseEvent: EventModel = new EventModel({"id": "a60ef10a-4ea1-4b94-be52-6ddad550abae", "name": name, "reservable": reservable});
            let expectedRequest = new EventModel({"name": name, "reservable": reservable});

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("post");
                expect(request.url).toContain("/api/event");

                expect(request.config.data).toBe(JSON.stringify(expectedRequest));

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseEvent)
                }).finally(done());
            });

            await addEvent(expectedRequest, token).then((response: AxiosResponse) => {
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(responseEvent));
            });

        });

        it('get by id', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let reservable = new SeatModel({"id": "reservablePromise id"});
            let expectedRequestAuthorization = "Bearer " + token;
            let responseEvent = new EventModel({"id": id ,"reservable": reservable, "reservations": []});

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/event/"+id);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseEvent)
                }).finally(done());
            });

            await getEventById(id, token).then((response:AxiosResponse)=>{
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(responseEvent));
            });

        });

        it('get all', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let reservable = new SeatModel({"id": "reservablePromise id"});
            let expectedRequestAuthorization = "Bearer " + token;
            let responseEvents = [new EventModel({"id": id ,"reservable": reservable, "reservations": []})];

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/event");

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseEvents)
                }).finally(done());
            });

            await getAllEvents(token).then((response:AxiosResponse)=>{
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(responseEvents));
            });

        });

        it('edit', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let reservable = new SeatModel({"id": "reservablePromise id"});
            let updateMap = new EventModel({"id": id, "name": "other event name"});
            let updatedEvent = new EventModel({"id": id ,"reservable": reservable, "name": "other event name","reservations": []});

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("put");
                expect(request.url).toContain("/api/event/"+id);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(updatedEvent)
                }).finally(done());
            });

            await updateEvent(updateMap, token).then((response:AxiosResponse)=>{
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(updatedEvent));
            });

        });


        it('delete', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("delete");
                expect(request.url).toContain("/api/event/"+id);

                request.respondWith({
                    status: 200,
                }).finally(done());
            });

            await deleteEventById(id, token);

        });
    });

    describe('reservable tests', ()=>{
        it('add reservable', async (done)=>{
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let space = new SpaceModel({"id": "5fb49a04-572a-4714-9809-88c0e9d816a7", "name": "reservableName", "space": "spaceId","reservables": ["reservable id"],"events": ["event id"], "reservations": ["reservations id"]});
            let responseData = {
                "type": "Space",
                "id": "5fb49a04-572a-4714-9809-88c0e9d816a7",
                "name": "reservableName",
                "events": ["event id"],
                "reservations": ["reservations id"],
                "space": "space id",
                "reservables": ["reservable id"]};

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("post");
                expect(request.url).toContain("/api/reservable");

                expect(request.config.data).toBe(JSON.stringify(space));

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseData)
                }).finally(done());
            });

            await addReservable(space, token).then((response: AxiosResponse)=>{
                expect(response.data).toMatchObject(responseData);
            });
        });

        it('get by id', async (done)=>{
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let space = new SpaceModel({id: "5fb49a04-572a-4714-9809-88c0e9d816a7"});
            let responseData = {
                "type": "Space",
                "id": "5fb49a04-572a-4714-9809-88c0e9d816a7",
                "name": "reservableName",
                "events": ["event id"],
                "reservations": ["reservations id"],
                "space": "space id",
                "reservables": ["reservable id"]};

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/reservable/"+space.id);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseData)
                }).finally(done());
            });

            await getReservableById((space.id as string), token).then((response: AxiosResponse)=>{
                expect(response.data).toMatchObject(responseData);
            });
        });

        it('delete by id', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("delete");
                expect(request.url).toContain("/api/reservable/"+id);

                request.respondWith({
                    status: 200,
                }).finally(done());
            });

            await deleteReservableById(id, token);

        });
    });

    describe('reservations tests', ()=>{
        it('add reservations', async (done)=>{
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let reservable = new SeatModel( {"id":"reservable id"});
            let reservation = new ReservationModel({"id": "5fb49a04-572a-4714-9809-88c0e9d816a7", "account": "account id", "event": "event id", "reservable": reservable});
            let responseData = {
                "id": "5fb49a04-572a-4714-9809-88c0e9d816a7",
                "account": "account id",
                "event": "event id",
                "reservable": "reservable id"
            };

            moxios.wait(()=>{
                let requests = moxios.requests;
                let request = requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("post");
                expect(request.url).toContain("/api/reservation/");

                expect(request.config.data).toBe(JSON.stringify(reservation));

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseData)
                }).finally(done());
            });

            await addReservation(reservation, token).then((response: AxiosResponse)=>{
                expect(response.data).toMatchObject(responseData);
            });

        });

        it('get reservation by id', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let reservable = new SeatModel({"id": "reservable id"});
            let expectedRequestAuthorization = "Bearer " + token;
            let responseReservation = new ReservationModel({"id": id,"account": "account id", "event": "event id", "reservable": reservable});

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/reservation/"+id);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseReservation)
                }).finally(done());
            });

            await getReservationById(id, token).then((response:AxiosResponse)=>{
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(responseReservation));
            });

        });

        it('get all reservations', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let reservable = new SeatModel({"id": "reservable id"});
            let expectedRequestAuthorization = "Bearer " + token;
            let responseReservations = [new ReservationModel({"id": id,"account": "account id", "event": "event id", "reservable": reservable})];

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("get");
                expect(request.url).toContain("/api/reservation/");

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseReservations)
                }).finally(done());
            });

            await getReservationById(id, token).then((response:AxiosResponse)=>{
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(responseReservations));
            });

        });

        it('edit reservations', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let reservable = new SeatModel({"id": "reservable id"});
            let updateMap = new ReservationModel({"id": id, "event": "other event id"});
            let updatedReservation = new ReservationModel({"id": id, "account": "account id", "event": "other event id", "reservable": reservable});

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("put");
                expect(request.url).toContain("/api/reservation/"+id);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(updatedReservation)
                }).finally(done());
            });

            await updateReservation(updateMap, token).then((response:AxiosResponse)=>{
                expect(JSON.stringify(response.data)).toBe(JSON.stringify(updatedReservation));
            });

        });

        it('delete reservations', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;

            moxios.wait(()=>{
                let request = moxios.requests.mostRecent();

                let authorization = request.config.headers.Authorization;
                expect(authorization).toBe(expectedRequestAuthorization);

                expect(request.config.method).toBe("delete");
                expect(request.url).toContain("/api/reservation/"+id);

                request.respondWith({
                    status: 200,
                }).finally(done());
            });

            await deleteReservationById(id, token);

        });
    });
});

it('functional basic test', async (done)=>{
    jest.setTimeout(10000);
    //add admin, if not added, then add

    let adminAccount: AccountModel = new AccountModel({"login": "admin", "password": "admin", "roles": ["ROLE_ADMIN"]});

    await addAccount(adminAccount).catch(async (reason: any)=> {
        if (reason.errno === "ECONNREFUSED") done.fail(reason.message);
    });

    let adminToken = await getTokenFromApi(new AccountModel({"login": "admin","password": "admin"}))
            .then((response: AxiosResponse)=>{
            return response.data.token;
        });

    //add user, if had added, then delete and add
    let accountToDelete: AccountModel|undefined = await getAccountFiltered(new AccountModel({"login": "user"}), adminToken)
        .then((response: AxiosResponse) =>
        {
            if (Array.isArray(response.data))
                if (response.data.length === 1)
                    return new AccountModel(response.data[0]);
            return undefined;
        });

    if( accountToDelete !== undefined)
        await deleteAccountById((accountToDelete.id as string), adminToken);

    await addAccount(new AccountModel({"login": "user", "password": "user"}));
    let [userToken, userId] = await getTokenFromApi(new AccountModel({"login": "user", "password": "user"})).then((response: AxiosResponse) =>{
        return [response.data.token, response.data.account];
    });

        //add seat
    let seat = await addReservable(new SeatModel({"name": "mySeat"}), adminToken)
        .catch((reason: any)=>done.fail(reason))
        .then((response: AxiosResponse) => new SeatModel(response.data));

    //add event
    let event = await addEvent(new EventModel({"name": "event1", "reservable": seat}), adminToken)
        .catch((reason: any)=>done.fail(reason))
        .then((response: AxiosResponse) => new EventModel(response.data));

    //add reservations
    let reservation = await addReservation(new ReservationModel({"account": userId, "event": event.id, "reservable": seat}), userToken)
        .catch((reason: any)=>done.fail(reason))
        .then((response: AxiosResponse)=> new ReservationModel(response.data));

    //get user reservations from account
    let userAccount = await getAccountById(userId, userToken)
        .catch((reason: any)=>done.fail(reason))
        .then((response: AxiosResponse)=>new AccountModel(response.data));

    expect(userAccount.reservations).toHaveLength(1);
    expect(userAccount.reservations[0]).toBe(reservation.id);
    done();
});

