import Cookies from 'universal-cookie';

const cookies = new Cookies();

function getCookie(name) {
    return cookies.get(name);
}

function addCookie(name, value){
    cookies.set(name, value);
}

export {addCookie, getCookie}