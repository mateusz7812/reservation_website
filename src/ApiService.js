const axios = require('axios').default;

const api_url = "http://127.0.0.1:8080";

function register(login, password) {
    return axios.post(api_url+"/api/account", {"login": login, "password": password});
}

function login(login, password){
    return axios.get(api_url+"/authenticate", {
        auth:
            {
                login: login,
                password: password
            }
    }
    );
}

function getAccountById(id, token){
    return axios.get(api_url+"/api/account"+id, {headers: {'Authorization': "Bearer " + token}});
}

export {register, login, getAccountById}