import Cookies from 'universal-cookie';
import AccountModel from "../dataModels/AccountModel";

const cookies = new Cookies();

function getCookie(name: string) {
    return cookies.get(name);
}

function addCookie(name: string, value: string){
    cookies.set(name, value);
}

function setToken(token: string) {
    addCookie("token", token);
}

function getToken(): string| undefined{
    let token = getCookie("token");
    if(token !== undefined){
        return token;
    }
    return undefined;
}


function setAccount(account: AccountModel){
    addCookie("account", JSON.stringify(account));
}

function getAccount(): AccountModel | undefined{
    let accountJson = getCookie("account");
    if(accountJson === undefined)
        return undefined;
    else
        {
            return new AccountModel(accountJson);
        }
}

function isLogged(){
    return getAccount() !== undefined && getToken() !== undefined;
}

const CookieService = {addCookie, getToken, setToken, setAccount, getAccount, isLogged};
export {addCookie, getCookie, getToken};
export default CookieService;