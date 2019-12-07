import moxios from "moxios";
import {getAccountById, login, register} from "../ApiService";

beforeEach(function () {
    moxios.install()
});

afterEach(function () {
    moxios.uninstall()
});

it('api register user', (done)=>{

    let requestAccount = {"login":"user","password":"password"};
    let responseAccount = {"id":"f385e685-2933-4207-b945-a1198b4154c5","reservations":[],"login":"user","password":"password"};

    let registerResponse = register("user", "password");
    registerResponse.then((response)=>{
        expect(response.data).toMatchObject(responseAccount);
    });

    moxios.wait(() => {
        let request = moxios.requests.mostRecent();

        let data = request.config.data;
        expect(data).toBe(JSON.stringify(requestAccount));

        request.respondWith({
            status: 200,
            response: JSON.stringify(responseAccount)
        }).then(done())
    });

});

it('api authenticate user', (done)=>{

    let responseAuth = {"login":"user","password":"password"};
    let responseToken = {"id":"f385e685-2933-4207-b945-a1198b4154c5","token":"BZ3BL34T3FrSJJP0Pmm7O","account":"decf9766-f9ac-4ff5-a21e-36deb31b4104"};

    let loginResponse = login("user", "password");
    loginResponse.then((response)=>{
        expect(response.data).toMatchObject(responseToken);
    });

    moxios.wait(() => {
        let request = moxios.requests.mostRecent();

        let auth = request.config.auth;
        expect(auth).toMatchObject(responseAuth);

        request.respondWith({
            status: 200,
            response: JSON.stringify(responseToken)
        }).then(done())
    });

});

it('get account', (done)=>{
    let id = "decf9766-f9ac-4ff5-a21e-36deb31b4104";
    let token = "tokentokentoken";
    let expectedRequestAuthorization = "Bearer " + token;
    let responseAccount = {
        "id": "decf9766-f9ac-4ff5-a21e-36deb31b4104",
        "reservations": [],
        "roles": [
            "ROLE_USER"
        ],
        "login": "user"
    };

    let getAccountResponse = getAccountById(id, token);
    getAccountResponse.then((response)=>{
        expect(response.data).toMatchObject(responseAccount);
    });

    moxios.wait(()=>{
        let request = moxios.requests.mostRecent();

        let authorization = request.config.headers.Authorization;
        expect(authorization).toBe(expectedRequestAuthorization);

        request.respondWith({
            status: 200,
            response: JSON.stringify(responseAccount)
        }).then(done());
    });
});
