import {addCookie, getCookie} from "../CookieService";

it('cookie service', ()=>{
    addCookie("testName", "testValue");

    let cookieValue = getCookie("testName");
    expect(cookieValue).toBe("testValue");
});
