import moxios from "moxios";
import {register} from "../ApiMethods";

beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install()
});

afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall()
});

it('api register user', (done)=>{

    let requestAccount = {"login":"user","password":"password"};
    let responseAccount = {"id":"f385e685-2933-4207-b945-a1198b4154c5","reservations":[],"login":"user","password":"password"};

    let registerResponse = register("user", "password");
    registerResponse.then((response)=>{
        expect(JSON.stringify(response.data)).toBe(JSON.stringify(responseAccount));
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

