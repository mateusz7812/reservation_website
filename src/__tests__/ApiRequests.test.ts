import moxios from "moxios";
import {
    addEvent,
    addReservable,
    addReservation,
    deleteReservationById,
    getAccountById,
    getReservationById,
    getTokenForAccount,
    addAccount,
    updateReservation,
    getAccountFiltered,
    deleteAccountById,
    getReservableById,
    deleteReservableById,
    getEventById, deleteEventById
} from "../domain/ApiRequests";
import Account from "../dataModels/Account";
import {AxiosResponse} from "axios";
import Event from "../dataModels/Event";
import {Reservable, Seat, Space} from "../dataModels/Reservable";
import Reservation from "../dataModels/Reservation";

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

            let requestAccount = new Account(undefined, "user", "password");
            let responseAccount: Account = new Account("f385e685-2933-4207-b945-a1198b4154c5", "user");

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();

                expect(request.config.method).toBe("post");
                expect(request.url).toContain("/api/account");

                expect(Object.assign(new Account(), JSON.parse(request.config.data))).toMatchObject(requestAccount);

                request.respondWith({
                    status: 200,
                    response: JSON.stringify(responseAccount)
                }).finally(done())
            });

            await addAccount(requestAccount).then((response: AxiosResponse)=>{
                expect(Object.assign(new Account(), response.data)).toMatchObject(responseAccount);
                done();
            });

        });

        it('api authenticate user',  async (done)=>{

            let requestAccount = new Account(undefined, "user","password");
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

            await getTokenForAccount(requestAccount).then((response: AxiosResponse)=>{
                expect(response.data).toMatchObject(tokenResponse);
            });

        });

        it('get account by id', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let responseAccount = new Account("decf9766-f9ac-4ff5-a21e-36deb31b4104","user",undefined,  [], []);

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
                expect(Object.assign(new Account(), response.data)).toMatchObject(responseAccount);
            });

        });


        it('get account filtered by login', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let accountFilter = new Account(undefined, "user");
            let responseAccount = new Account(id,"user",undefined,  [], []);

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
                expect(Object.assign(new Account(), response.data)).toMatchObject(responseAccount);
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
            let reservable = Reservable.new({type: "Seat", id: "decf9766-f9ac-4ff5-a21e-36deb31b4104", reservations:[]});
            let responseEvent: Event = new Event("a60ef10a-4ea1-4b94-be52-6ddad550abae", name, reservable);
            let expectedRequest = new Event(undefined, name, reservable);

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
            let reservable = new Seat({"id": "reservable id"});
            let expectedRequestAuthorization = "Bearer " + token;
            let responseEvent = new Event(id,undefined, reservable, []);

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

        it('delete reservation', async (done)=>{
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
            let space = new Space({"id": "5fb49a04-572a-4714-9809-88c0e9d816a7", "name": "reservableName", "space": "spaceId","reservables": ["reservable id"],"events": ["event id"], "reservations": ["reservation id"]});
            let responseData = {
                "type": "Space",
                "id": "5fb49a04-572a-4714-9809-88c0e9d816a7",
                "name": "reservableName",
                "events": ["event id"],
                "reservations": ["reservation id"],
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
            let space = new Space({id: "5fb49a04-572a-4714-9809-88c0e9d816a7"});
            let responseData = {
                "type": "Space",
                "id": "5fb49a04-572a-4714-9809-88c0e9d816a7",
                "name": "reservableName",
                "events": ["event id"],
                "reservations": ["reservation id"],
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

    describe('reservation tests', ()=>{
        it('add reservation', async (done)=>{
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let reservable = new Seat( {"id":"reservable id"});
            let reservation = new Reservation("5fb49a04-572a-4714-9809-88c0e9d816a7", "account id", "event id", reservable);
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
                expect(request.url).toContain("/api/reservation");

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

        it('get reservation', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let reservable = new Seat({"id": "reservable id"});
            let expectedRequestAuthorization = "Bearer " + token;
            let responseReservation = new Reservation(id,"account id", "event id", reservable);

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

        it('edit reservation', async (done)=>{
            let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
            let token = "BZ3BL34T3FrSJJP0Pmm7O";
            let expectedRequestAuthorization = "Bearer " + token;
            let reservable = new Seat({"id": "reservable id"});
            let updateMap = new Reservation(id, undefined,"other event id");
            let updatedReservation = new Reservation(id, "account id", "other event id", reservable);

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

        it('delete reservation', async (done)=>{
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

    let adminAccount: Account = new Account(undefined, "admin", "admin", undefined, ["ROLE_ADMIN"]);

    await addAccount(adminAccount).catch(async (reason: any)=> {
        if (reason.errno === "ECONNREFUSED") done.fail(reason.message);
    });

    let adminToken = await getTokenForAccount(new Account(undefined, "admin", "admin"))
            .then((response: AxiosResponse)=>{
            return response.data.token;
        });

    //add user, if had added, then delete and add
    let accountToDelete: Account|undefined = await getAccountFiltered(new Account(undefined, "user"), adminToken).then((response: AxiosResponse) => Object.assign(new Account(), response.data[0]));

    if( accountToDelete !== undefined)
        await deleteAccountById((accountToDelete.id as string), adminToken);

    await addAccount(new Account(undefined, "user", "user"));
    let [userToken, userId] = await getTokenForAccount(new Account(undefined, "user", "user")).then((response: AxiosResponse) =>{
        return [response.data.token, response.data.account];
    });
        //add seat
    let seat = await addReservable(new Seat({"name": "mySeat"}), adminToken).catch((reason: any)=>done.fail(reason)).then((response: AxiosResponse) => {
        return Object.assign(new Seat({}), response.data);
    });

    //add event
    let event = await addEvent(new Event(undefined, "event1", seat), adminToken).catch((reason: any)=>done.fail(reason)).then((response: AxiosResponse) =>
        Object.assign(new Event(), response.data));

    //add reservation
    let reservation = await addReservation(new Reservation(undefined, userId, event.id, seat), userToken).catch((reason: any)=>done.fail(reason)).then((response: AxiosResponse)=>
        Object.assign(new Reservation(), response.data));

    //get user reservations from account
    let userAccount = await getAccountById(userId, userToken).catch((reason: any)=>done.fail(reason)).then((response: AxiosResponse)=>Object.assign(new Account(), response.data));

    expect(userAccount.reservations).toHaveLength(1);
    expect(userAccount.reservations[0]).toBe(reservation.id);
    done();
});

