import Cookies from 'universal-cookie';

const cookies = new Cookies();

function getCookie(name: string) {
    return cookies.get(name);
}

function addCookie(name: string, value: string){
    cookies.set(name, value);
}

function getToken(): string| undefined{
    let token = getCookie("token");
    if(token !== undefined){
        return token;
    }
    return undefined;
}

export {addCookie, getCookie, getToken}