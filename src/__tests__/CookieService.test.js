import CookieService, {addCookie, getCookie} from "../services/CookieService";
import AccountModel from "../dataModels/AccountModel";

it('cookie service', ()=>{
    addCookie("testName", "testValue");

    let cookieValue = getCookie("testName");
    expect(cookieValue).toBe("testValue");
});

it('account get set', ()=>{
    let account = new AccountModel({"id": "account1", "login":"account1"});
    CookieService.setAccount(account);
    let accountFromCookies = CookieService.getAccount();
    expect(accountFromCookies).toMatchObject(account);
});

it('log out', ()=>{
    let account = new AccountModel({"id": "account1", "login":"account1"});
    CookieService.setAccount(account);
    CookieService.setToken("token");

    expect(CookieService.isLogged()).toBeTruthy();
    CookieService.logOut();
    expect(CookieService.isLogged()).toBeFalsy();

});