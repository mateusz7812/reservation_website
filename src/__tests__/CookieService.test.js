import {addCookie, getCookie} from "../services/CookieService";

it('cookie service', ()=>{
    addCookie("testName", "testValue");

    let cookieValue = getCookie("testName");
    expect(cookieValue).toBe("testValue");
});
