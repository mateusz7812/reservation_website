const axios = require('axios').default;

const api_url = "http://127.0.0.1:8080";

function register(user, password) {
    return axios.post(api_url+"/api/account", {"login": user, "password": password});
}


export {register}